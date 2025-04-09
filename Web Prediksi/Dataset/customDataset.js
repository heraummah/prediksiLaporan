async function fetchData() {
    const sheetID = "1ZIoP34ihibJvp9A4l-nQlX1xC4vtMbOwn6nCw44bm6k";
    const apiKey = "AIzaSyC1w6Vvln0ym3bRI0BFdSpbDdv3V4TeBmY";
    const range = "Sheet1!C1:G142";
  
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${range}?key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.values) throw new Error("Data tidak ditemukan.");
  
      renderTable(data.values);
    } catch (error) {
      console.error("Error fetching data:", error);
      document.getElementById("data").innerHTML = "<p class='text-danger'>Gagal memuat data.</p>";
    }
  }
  
  function renderTable(values) {
    const tableId = "spreadsheet-table";
    const tableHtml = `
      <table id="${tableId}" class="table table-bordered table-striped table-hover" style="width:100%">
        <thead><tr>${values[0].map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>
          ${values.slice(1).map(row =>
            `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`
          ).join("")}
        </tbody>
        <tfoot><tr>${values[0].map(h => `<th>${h}</th>`).join("")}</tr></tfoot>
      </table>`;
  
    document.getElementById("data").innerHTML = tableHtml;
  
    // Tambahkan search per kolom
    $(() => {
      const table = $(`#${tableId}`).DataTable({
        dom: 'Bfrtip',
        buttons: ['csvHtml5', 'excelHtml5'],
        initComplete: function () {
          this.api().columns().every(function () {
            const column = this;
            const select = $('<select class="form-select form-select-sm"><option value="">Filter</option></select>')
              .appendTo($(column.footer()).empty())
              .on('change', function () {
                const val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? `^${val}$` : '', true, false).draw();
              });
  
            column.data().unique().sort().each(function (d) {
              select.append(`<option value="${d}">${d}</option>`);
            });
          });
        }
      });
    });
  }
  
  window.onload = fetchData;
  