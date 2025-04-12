document.addEventListener('DOMContentLoaded', () => {
  $('#adminTable').DataTable();

  // Tambah tombol logout ke dalam logout-container
  const logoutContainer = document.querySelector('.logout-container');
  logoutContainer.innerHTML = '<button id="logoutBtn">Logout</button>';

  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn.addEventListener('click', () => {
    Swal.fire({
      title: 'Yakin ingin logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF7350',
      cancelButtonColor: '#999',
      confirmButtonText: 'Ya, Logout',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '../index.html';
      }
    });
  });

  const tbody = document.querySelector('#adminTable tbody');

  laporanContoh.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.masuk}</td>
      <td>${item.nama}</td>
      <td>${item.jenis}</td>
      <td>${item.kota}</td>
      <td>${item.alamat}</td>
      <td>${item.laporan}</td>
      <td>${item.tanggal}</td>
      <td><a href="${item.bukti}" target="_blank">Lihat</a></td>
      <td><button class="btn-hapus">Hapus</button></td>
    `;
    tbody.appendChild(row);
  });

  // Tombol hapus dengan konfirmasi
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-hapus')) {
      Swal.fire({
        title: 'Yakin ingin menghapus laporan ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#FF7350',
        cancelButtonColor: '#999',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          e.target.closest('tr').remove();
        }
      });
    }
  
    if (e.target.classList.contains('btn-edit')) {
      Swal.fire({
        title: 'Edit belum tersedia',
        text: 'Fitur edit belum diimplementasikan.',
        icon: 'info'
      });
    }
  });  
});
