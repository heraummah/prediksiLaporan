document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggal').setAttribute('max', today);

  const form = document.getElementById('laporForm');
  const submitButton = document.getElementById('submitButton');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Validasi URL bukti
    const buktiUrl = document.getElementById('bukti').value.trim();
    if (!isValidUrl(buktiUrl)) {
      Swal.fire({
        icon: 'error',
        title: 'URL Tidak Valid',
        text: 'Mohon masukkan URL yang valid untuk bukti.',
        confirmButtonColor: '#d33'
      });
      return;
    }
    
    // Disable tombol submit untuk mencegah klik ganda
    submitButton.disabled = true;
    submitButton.textContent = 'Mengirim...';
    
    // Tampilkan loading
    Swal.fire({
      title: 'Mengirim laporan...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const scriptURL = "https://script.google.com/macros/s/AKfycbwH_PY6IVT-qxR09dWk_InEy2j55GqhBd3FGRdtT8fyW6AVnlI120vvwSfEqLqmGNQWvw/exec";

    // Kumpulkan semua data form
    const formData = new FormData(form);
    const plainData = new URLSearchParams();
    formData.forEach((value, key) => {
      plainData.append(key, value);
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
        // Kembalikan tombol submit ke keadaan awal
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim Laporan';
        
        Swal.fire({
          icon: 'success',
          title: 'Laporan Berhasil Dikirim!',
          text: data.message || 'Terima kasih atas partisipasi Anda.',
          confirmButtonColor: '#0253BE'
        });
        form.reset();
      })
      .catch(error => {
        // Kembalikan tombol submit ke keadaan awal
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim Laporan';
        
        console.error('Error!', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengirim Laporan!',
          text: 'Silakan coba lagi.',
          confirmButtonColor: '#d33'
        });
      });
  });
  
  // Fungsi untuk validasi URL
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
});