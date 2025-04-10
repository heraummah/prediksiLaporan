document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggal').setAttribute('max', today);

  const form = document.getElementById('laporForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const scriptURL = "https://script.google.com/macros/s/AKfycbwSqaRhCzzxKGrJ8mltwpzjTmcYyVlfakwNzApyNfDcJGzBWkg4nzIiu2yDzm-QNAAsaA/exec";
    const formData = new FormData(form);

    fetch(scriptURL, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        Swal.fire({
          icon: 'success',
          title: 'Laporan Berhasil Dikirim!',
          text: 'Terima kasih atas partisipasi Anda.',
          confirmButtonColor: '#0253BE'
        });
        form.reset();
      })
      .catch(error => {
        console.error('Error!', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengirim Laporan!',
          text: 'Silakan coba lagi.',
          confirmButtonColor: '#d33'
        });
      });
  });
});
