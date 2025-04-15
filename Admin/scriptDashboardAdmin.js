document.addEventListener('DOMContentLoaded', () => {
  // Ganti ini dengan API key dan Spreadsheet ID kamu
  const apiKey = "AIzaSyBxkZK0LMYDIFWm3DW0Jovdkd6PlCUfovk";
  const spreadsheetId = "1Ex_--mc8gL2-UWmkxPPXVtgCZXQxXI-Bec9_I21x8Ts";
  const range = "Sheet1!A2:J"; // Update range untuk mencakup kolom ID
  const scriptURL = "https://script.google.com/macros/s/AKfycbxGFBnG9srXpYjIKd1RRYGM1kdUfTwoXyrmSX1K-gqtn8bNs0bE8gl6DZPXAJI6BWjl/exec"; // Ganti dengan ID script Google Apps Script Anda

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
              <button class="btn-aksi" data-id="${id}">Hapus</button>
            </td>
          `;
          tableBody.appendChild(tr);
        });

        // Initialize DataTable dengan event delegation
        dataTable = $('#adminTable').DataTable();
        
        // Gunakan event delegation untuk tombol delete - ini akan bekerja di semua halaman pagination
        $('#adminTable tbody').on('click', '.btn-aksi', function() {
          const id = $(this).data('id');
          
          Swal.fire({
            title: 'Yakin ingin menghapus laporan ini?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF7350',
            cancelButtonColor: '#999',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
              // Tampilkan loading
              Swal.fire({
                title: 'Menghapus data...',
                text: 'Mohon tunggu sebentar',
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                }
              });
              
              // Kirim permintaan delete ke Google Apps Script
              const formData = new FormData();
              formData.append('action', 'delete');
              formData.append('id', id);
              
              fetch(scriptURL, {
                method: 'POST',
                body: formData
              })
              .then(response => response.json())
              .then(data => {
                if (data.status === 'success') {
                  // Hapus baris dari tabel
                  const row = $(this).closest('tr');
                  dataTable.row(row).remove().draw();
                  
                  Swal.fire(
                    'Berhasil!',
                    'Data telah dihapus.',
                    'success'
                  );
                } else {
                  Swal.fire(
                    'Gagal!',
                    data.message || 'Terjadi kesalahan saat menghapus data.',
                    'error'
                  );
                }
              })
              .catch(error => {
                console.error('Error:', error);
                Swal.fire(
                  'Gagal!',
                  'Terjadi kesalahan saat menghapus data.',
                  'error'
                );
              });
            }
          });
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="10" class="text-center">Tidak ada data</td></tr>';
        dataTable = $('#adminTable').DataTable();
      }
    })
    .catch(error => {
      console.error("Gagal mengambil data dari Google Sheets:", error);
      Swal.fire("Oops!", "Data gagal dimuat dari Spreadsheet.", "error");
      dataTable = $('#adminTable').DataTable();
    });
});