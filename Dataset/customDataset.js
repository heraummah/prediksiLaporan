// Fungsi untuk memuat data dari Google Sheets
async function fetchData() {
  const sheetID = "1ZIoP34ihibJvp9A4l-nQlX1xC4vtMbOwn6nCw44bm6k";
  const apiKey = "AIzaSyC1w6Vvln0ym3bRI0BFdSpbDdv3V4TeBmY";
  const range = "Sheet1!C1:G142";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${range}?key=${apiKey}`;

  try {
    // Tampilkan indikator loading
    document.getElementById("data").innerHTML = `
      <div class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Memuat data kejadian banjir...</p>
      </div>
    `;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) throw new Error("Data tidak ditemukan.");

    renderTable(data.values);
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("data").innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle me-2"></i> Gagal memuat data. Silakan coba lagi nanti.
      </div>
    `;
  }
}

// Fungsi untuk menampilkan tabel
function renderTable(values) {
  const tableId = "spreadsheet-table";
  const tableHtml = `
    <table id="${tableId}" class="table table-bordered table-striped table-hover" style="width:100%">
      <thead>
        <tr>${values[0].map(h => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${values.slice(1).map(row =>
          `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`
        ).join("")}
      </tbody>
      <tfoot>
        <tr>${values[0].map(h => `<th>${h}</th>`).join("")}</tr>
      </tfoot>
    </table>`;

  document.getElementById("data").innerHTML = tableHtml;

  // Inisialisasi DataTable dengan fitur tambahan
  $(() => {
    const table = $(`#${tableId}`).DataTable({
      dom: '<"d-flex justify-content-between align-items-center mb-3"Bf>rtip',
      buttons: [
        {
          extend: 'csv',
          text: '<i class="fas fa-file-csv me-2"></i>CSV',
          className: 'btn-export'
        },
        {
          extend: 'excel',
          text: '<i class="fas fa-file-excel me-2"></i>Excel',
          className: 'btn-export'
        }
      ],
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ data",
        info: "Menampilkan _START_ hingga _END_ dari _TOTAL_ data",
        infoEmpty: "Tidak ada data yang tersedia",
        infoFiltered: "(difilter dari _MAX_ total data)",
        zeroRecords: "Tidak ada data yang cocok dengan pencarian",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya"
        }
      },
      pageLength: 10,
      responsive: true,
      initComplete: function () {
        this.api().columns().every(function () {
          const column = this;
          const select = $('<select class="form-select form-select-sm"><option value="">Semua</option></select>')
            .appendTo($(column.footer()).empty())
            .on('change', function () {
              const val = $.fn.dataTable.util.escapeRegex($(this).val());
              column.search(val ? `^${val}$` : '', true, false).draw();
            });

          column.data().unique().sort().each(function (d) {
            if (d) { // Pastikan nilai tidak kosong
              select.append(`<option value="${d}">${d}</option>`);
            }
          });
        });
        
        // Tambahkan judul di atas tombol export
        $('.dt-buttons').prepend('<span class="me-3 text-primary"><i class="fas fa-download me-1"></i>Unduh Data:</span>');
      }
    });
    
    // Tambahkan event listener untuk row hover effect
    $(`#${tableId} tbody`).on('mouseenter', 'tr', function() {
      $(this).css('cursor', 'pointer');
    });
    
    // Tambahkan event listener untuk row click
    $(`#${tableId} tbody`).on('click', 'tr', function() {
      const data = table.row(this).data();
      if (data) {
        // Tampilkan detail jika diperlukan
        console.log("Data row:", data);
      }
    });
  });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  fetchData();
  
  // Mobile menu toggle (untuk konsistensi dengan halaman lain)
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
    
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
            
      // Change icon
      const icon = this.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Back to top button
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });
  
  backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});