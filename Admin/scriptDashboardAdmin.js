document.addEventListener("DOMContentLoaded", function () {
  // Ambil data laporan dari server
  fetch("get_laporan.php")
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector("#adminTable tbody");

      if (data && data.length > 0) {
        // Clear existing table data
        tableBody.innerHTML = '';
        
        data.forEach((item) => {
          // Standarisasi status - hanya gunakan 3 nilai: "Menunggu", "Diverifikasi", "Ditolak"
          let status = item.Status || "Menunggu";
          
          // Normalisasi berbagai kemungkinan nilai status
          if (status.toLowerCase().includes("belum") || status === "" || status === null) {
            status = "Menunggu";
          } else if (status.toLowerCase().includes("verifikasi") || status.toLowerCase().includes("diverifikasi")) {
            status = "Diverifikasi";
          } else if (status.toLowerCase().includes("tolak") || status.toLowerCase().includes("ditolak")) {
            status = "Ditolak";
          }

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${item.Id_Laporan}</td>
            <td>${item.Tanggal_Laporan}</td>
            <td>${item.Nama}</td>
            <td>${item.Jenis_Laporan}</td>
            <td>${item.Kota_Administrasi}</td>
            <td>${item.Alamat_Kejadian}</td>
            <td>${item.Tanggal_Kejadian}</td>
            <td>${item.Laporan}</td>
            <td>
              <button class="btn-view-evidence" data-bukti="${item.Bukti}">Lihat</button>
            </td>
            <td>
              <span class="status-badge status-${status.toLowerCase().replace(/\s+/g, "-")}">${status}</span>
            </td>
            <td>
              ${
                status === "Menunggu"
                  ? `
                <div class="btn-group">
                  <button class="btn-verifikasi" data-id="${item.Id_Laporan}">Verifikasi</button>
                  <button class="btn-tolak" data-id="${item.Id_Laporan}">Tolak</button>
                </div>
              `
                  : ""
              }
            </td>
          `;
          tableBody.appendChild(tr);
        });
        
        // Inisialisasi DataTable dengan mode aman
        try {
          if ($.fn.DataTable.isDataTable('#adminTable')) {
            $('#adminTable').DataTable().destroy();
          }
          
          $("#adminTable").DataTable({
            responsive: true,
            paging: true,
            ordering: true,
            info: true,
            language: {
              search: "Cari:",
              lengthMenu: "Tampilkan _MENU_ data per halaman",
              zeroRecords: "Tidak ada data yang ditemukan",
              info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
              infoEmpty: "Tidak ada data yang tersedia",
              infoFiltered: "(difilter dari _MAX_ total data)",
              paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
              }
            }
          });
        } catch (e) {
          console.error("DataTable initialization error:", e);
          // Tetap tampilkan data meskipun DataTable error
        }
      } else {
        tableBody.innerHTML = '<tr><td colspan="11">Tidak ada data</td></tr>';
      }

      // Event delegation untuk semua tombol dalam tabel
      document.querySelector("#adminTable tbody").addEventListener("click", function(e) {
        // Untuk tombol Lihat bukti
        if (e.target.classList.contains("btn-view-evidence")) {
          const buktiFile = e.target.getAttribute("data-bukti");
          handleViewEvidence(buktiFile);
        }
        
        // Untuk tombol Verifikasi
        if (e.target.classList.contains("btn-verifikasi")) {
          const id = e.target.getAttribute("data-id");
          const row = e.target.closest("tr");
          updateStatus(id, "Diverifikasi", row);
        }
        
        // Untuk tombol Tolak
        if (e.target.classList.contains("btn-tolak")) {
          const id = e.target.getAttribute("data-id");
          const row = e.target.closest("tr");
          updateStatus(id, "Ditolak", row);
        }
      });
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      Swal.fire("Oops!", "Gagal memuat data dari server.", "error");
    });

  // Fungsi untuk menampilkan bukti
  function handleViewEvidence(buktiFile) {
    if (!buktiFile) {
      Swal.fire({
        title: "Tidak Ada Bukti",
        text: "Tidak ada file bukti yang diunggah untuk laporan ini.",
        icon: "info"
      });
      return;
    }
  
    // Cek apakah ekstensi file adalah gambar
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(buktiFile);
    
    // Path yang benar berdasarkan struktur folder
    const buktiPath = "../Lapor/uploads/" + buktiFile;
    
    if (isImage) {
      // Menampilkan gambar dalam modal
      Swal.fire({
        title: 'Bukti Laporan',
        html: `
          <div class="image-container">
            <img src="${buktiPath}" 
                 alt="Bukti Laporan" 
                 style="max-width: 100%; max-height: 400px;">
          </div>
          <p class="mt-3">Nama File: ${buktiFile}</p>
        `,
        width: 600,
        confirmButtonText: 'Tutup',
        showCloseButton: true
      });
    } else {
      // Jika bukan gambar, tampilkan info tentang file
      Swal.fire({
        title: 'Bukti Laporan',
        html: `
          <div class="file-info">
            <p><strong>Nama File:</strong> ${buktiFile}</p>
            <p>File ini bukan gambar dan tidak dapat ditampilkan langsung.</p>
            <p>Silakan akses file secara manual di lokasi:</p>
            <code>${buktiPath}</code>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Tutup'
      });
    }
  }

  // Fungsi untuk update status
  function updateStatus(id, status, row) {
    Swal.fire({
      title: `Yakin ingin ${status.toLowerCase()} laporan ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "Diverifikasi" ? "#28a745" : "#dc3545",
      cancelButtonColor: "#999",
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("status", status);

        fetch("update_status.php", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.text())
          .then((text) => {
            // Parse JSON response
            let response;
            try {
              response = JSON.parse(text);
            } catch (e) {
              console.error("Parse error:", e, "Raw response:", text);
              throw new Error("Respons server tidak valid");
            }
            
            if (response.status === "success") {
              // Update tampilan tabel
              const statusCell = row.querySelector("td:nth-child(10)");
              const aksiCell = row.querySelector("td:nth-child(11)");

              statusCell.innerHTML = `<span class="status-badge status-${status.toLowerCase().replace(/\s+/g, "-")}">${status}</span>`;
              aksiCell.innerHTML = "";

              // Tampilkan notifikasi sukses
              Swal.fire({
                title: "Berhasil!",
                text: `Status laporan diubah menjadi ${status}`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              throw new Error(response.message || "Gagal memperbarui status");
            }
          })
          .catch((err) => {
            console.error("Update error:", err);
            Swal.fire("Error", err.message || "Terjadi kesalahan saat memperbarui status", "error");
          });
      }
    });
  }
});