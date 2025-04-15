document.addEventListener('DOMContentLoaded', () => {
  // Ganti ini dengan API key dan Spreadsheet ID kamu
  const apiKey = "AIzaSyBxkZK0LMYDIFWm3DW0Jovdkd6PlCUfovk";
  const spreadsheetId = "1Ex_--mc8gL2-UWmkxPPXVtgCZXQxXI-Bec9_I21x8Ts";
  const range = "Sheet1!A2:K"; // Update range untuk mencakup kolom status verifikasi
  const scriptURL = "https://script.google.com/macros/s/AKfycby8hIZouP23nPvp3ZPkV_FjDEMAWh_Is0foVmjrgT0RPvDLQfb71A4MVU1Ox2I9wrmHzA/exec"; // Ganti dengan ID script Google Apps Script Anda

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  let dataTable;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rows = data.values;
      const tableBody = document.querySelector("#adminTable tbody");
      tableBody.innerHTML = ""; // Kosongkan tabel sebelum mengisi data baru

      if (rows && rows.length > 0) {
        rows.forEach((row, index) => {
          const id = row[0] || "-";           // ID (kolom A)
          const masuk = row[1] || "-";        // Timestamp (kolom B)
          const nama = row[2] || "-";         // Nama (kolom C)
          const jenisLaporan = row[3] || "-"; // Jenis Laporan (kolom D)
          const kota = row[4] || "-";         // Kota (kolom E)
          const alamat = row[5] || "-";       // Alamat (kolom F)
          const tanggal = row[6] || "-";      // Tanggal (kolom G)
          const laporan = row[7] || "-";      // Laporan (kolom H)
          const bukti = row[8] || "#";        // Bukti (kolom I)
          const status = row[9] || "Menunggu"; // Status verifikasi (kolom J)

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${id}</td>
            <td>${masuk}</td>
            <td>${nama}</td>
            <td>${jenisLaporan}</td>
            <td>${kota}</td>
            <td>${alamat}</td>
            <td>${tanggal}</td>
            <td>${laporan}</td>
            <td><a href="${bukti}" target="_blank">Lihat</a></td>
            <td>
              <span class="status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>
            </td>
            <td>
              <div class="btn-group">
                ${status === "Menunggu" ? `
                  <button class="btn-verifikasi" data-id="${id}">Verifikasi</button>
                  <button class="btn-tolak" data-id="${id}">Tolak</button>
                ` : ``}
              </div>
            </td>
          `;
          tableBody.appendChild(tr);
        });

        // Initialize DataTable dengan event delegation
        dataTable = $('#adminTable').DataTable();
        
        // Event delegation untuk tombol verifikasi
        $('#adminTable tbody').on('click', '.btn-verifikasi', function() {
          const id = $(this).data('id');
          verifikasiLaporan(id, "Diverifikasi", $(this));
        });
        
        // Event delegation untuk tombol tolak
        $('#adminTable tbody').on('click', '.btn-tolak', function() {
          const id = $(this).data('id');
          verifikasiLaporan(id, "Ditolak", $(this));
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="11" class="text-center">Tidak ada data</td></tr>';
        dataTable = $('#adminTable').DataTable();
      }
    })
    .catch(error => {
      console.error("Gagal mengambil data dari Google Sheets:", error);
      Swal.fire("Oops!", "Data gagal dimuat dari Spreadsheet.", "error");
      dataTable = $('#adminTable').DataTable();
    });
  
  // Fungsi untuk menangani verifikasi/penolakan laporan
  function verifikasiLaporan(id, status, button) {
    Swal.fire({
      title: `Yakin ingin ${status.toLowerCase()} laporan ini?`,
      text: `Status laporan akan berubah menjadi "${status}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === "Diverifikasi" ? '#28a745' : '#dc3545',
      cancelButtonColor: '#999',
      confirmButtonText: `Ya, ${status.toLowerCase()}`,
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Tampilkan loading
        Swal.fire({
          title: `${status} laporan...`,
          text: 'Mohon tunggu sebentar',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Kirim permintaan verifikasi ke Google Apps Script
        const formData = new FormData();
        formData.append('action', 'verify');
        formData.append('id', id);
        formData.append('status', status);
        
        fetch(scriptURL, {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            // Update tampilan row tanpa reload
            const row = button.closest('tr');
            const statusCell = row.find('td:nth-child(10)');
            const actionCell = row.find('td:nth-child(11)');
            
            statusCell.html(`<span class="status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>`);
            actionCell.html(`<div class="btn-group"></div>`); // Kosongkan kolom aksi
            
            Swal.fire(
              'Berhasil!',
              `Laporan berhasil ${status.toLowerCase()}.`,
              'success'
            );
          } else {
            Swal.fire(
              'Gagal!',
              data.message || 'Terjadi kesalahan saat memproses laporan.',
              'error'
            );
          }
        })
        .catch(error => {
          console.error('Error:', error);
          Swal.fire(
            'Gagal!',
            'Terjadi kesalahan saat memproses laporan.',
            'error'
          );
        });
      }
    });
  }
});