document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tanggal').setAttribute('max', today);

  const form = document.getElementById('laporForm');
  const submitButton = document.getElementById('submitButton');

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

  // Form Submit Handler with AJAX
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Validasi file gambar
    const buktiFile = document.getElementById('bukti').files[0];
    if (!buktiFile) {
      Swal.fire({
        icon: 'error',
        title: 'File Tidak Ditemukan',
        text: 'Mohon pilih file gambar sebagai bukti.',
        confirmButtonColor: '#FF7350'
      });
      return;
    }
    
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(buktiFile.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Format File Tidak Valid',
        text: 'Format file harus JPG, PNG, atau GIF.',
        confirmButtonColor: '#FF7350'
      });
      return;
    }
    
    // Validasi ukuran file (max 2MB)
    if (buktiFile.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Ukuran File Terlalu Besar',
        text: 'Ukuran file maksimum adalah 2MB.',
        confirmButtonColor: '#FF7350'
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

    // Kumpulkan semua data form
    const formData = new FormData(form);
    
    // Kirim data dengan fetch API
    fetch('../Lapor/process.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      // Debug untuk melihat respons mentah
      console.log('Status response:', response.status);
      return response.text(); // Dapatkan teks respons dulu
    })
    .then(text => {
      console.log('Raw response:', text);
      try {
        return JSON.parse(text); // Coba parse ke JSON
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Respons tidak valid: ' + text);
      }
    })
    .then(data => {
      // Kembalikan tombol submit ke keadaan awal
      submitButton.disabled = false;
      submitButton.textContent = 'Kirim Laporan';
      
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Laporan Berhasil Dikirim!',
          text: data.message || 'Terima kasih atas partisipasi Anda. Laporan Anda akan segera diproses.',
          confirmButtonColor: '#4AB4FF'
        }).then((result) => {
          if (result.isConfirmed) {
            // Setelah pengguna mengklik ok, clear form
            form.reset();
            
            // Reset preview gambar
            document.getElementById('preview-img').style.display = 'none';
            
            // Optional: Scroll ke atas setelah submit
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Mengirim Laporan!',
          text: data.message || 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi nanti.',
          confirmButtonColor: '#FF7350'
        });
      }
    })
    .catch(error => {
      // Kembalikan tombol submit ke keadaan awal
      submitButton.disabled = false;
      submitButton.textContent = 'Kirim Laporan';
      
      console.error('Error!', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim Laporan!',
        text: 'Terjadi kesalahan saat mengirim laporan. Silakan coba lagi nanti.',
        confirmButtonColor: '#FF7350'
      });
    });
  });
  
  // Form validation visual cues
  const formInputs = form.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value.trim() !== '') {
        this.classList.add('filled');
      } else {
        this.classList.remove('filled');
      }
    });
  });
  
  // Preview gambar saat dipilih
  document.getElementById('bukti').addEventListener('change', function(e) {
    const previewImg = document.getElementById('preview-img');
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
      }
      
      reader.readAsDataURL(file);
    } else {
      previewImg.src = '#';
      previewImg.style.display = 'none';
    }
  });
});