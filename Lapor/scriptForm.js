document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggal').setAttribute('max', today);

  const form = document.getElementById('laporForm');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const scriptURL = "https://script.google.com/macros/s/AKfycbyXXrMAHcyQ6s_E7mDVJmG5pqHpD94Do9r1ak6Yc0D5jZW_HGmruqqwRlo4rm9qGsEkNg/exec";

    const formData = new FormData(form);
    
    // Jika hanya ingin kirim data TEXT-nya saja:
    const plainData = new URLSearchParams();
    formData.forEach((value, key) => {
      if (key !== "bukti") {
        plainData.append(key, value);
      }
    });

    fetch(scriptURL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: plainData
    })
      .then(response => response.json())
      .then(data => {
        Swal.fire({
          icon: 'success',
          title: 'Laporan Berhasil Dikirim!',
          text: data.message || 'Terima kasih atas partisipasi Anda.',
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
