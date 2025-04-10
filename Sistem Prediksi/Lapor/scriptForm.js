document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').setAttribute('max', today);
  
    const form = document.getElementById('laporForm');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      Swal.fire({
        icon: 'success',
        title: 'Laporan Berhasil Dikirim!',
        text: 'Terima kasih atas partisipasi Anda.',
        confirmButtonColor: '#0253BE'
      });
  
      form.reset();
    });
  });
  