// uiAdmin.js - UI interactions for admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Navigation bar scroll effect
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
      // Add scrolled class to navbar when scrolling
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        backToTopBtn.classList.add('active');
      } else {
        navbar.classList.remove('scrolled');
        backToTopBtn.classList.remove('active');
      }
    });
    
    // Mobile menu toggle
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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (navLinks && navLinks.classList.contains('active') && 
          !event.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
    
    // Back to top button
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Custom styling for DataTables
    if ($.fn.dataTable) {
      $.fn.dataTable.ext.classes.sWrapper = 'dataTables_wrapper dt-custom';
      
      // Custom styling for DataTables search
      $(document).on('keyup', '.dataTables_filter input', function() {
        if ($(this).val().length > 0) {
          $(this).addClass('has-content');
        } else {
          $(this).removeClass('has-content');
        }
      });
    }
    
    // Tooltips for action buttons
    const addTooltips = () => {
      const verifikasiButtons = document.querySelectorAll('.btn-verifikasi');
      const tolakButtons = document.querySelectorAll('.btn-tolak');
      
      verifikasiButtons.forEach(button => {
        button.setAttribute('title', 'Verifikasi Laporan');
      });
      
      tolakButtons.forEach(button => {
        button.setAttribute('title', 'Tolak Laporan');
      });
    };
    
    // Call addTooltips after DataTables is initialized
    const checkDataTablesReady = setInterval(() => {
      if (document.querySelector('.dataTable')) {
        addTooltips();
        clearInterval(checkDataTablesReady);
      }
    }, 500);
    
    // Re-apply tooltips when DataTables is redrawn
    $(document).on('draw.dt', function() {
      addTooltips();
    });
    
    // Customize SweetAlert2 confirmations
    if (window.Swal) {
      // Set default values for SweetAlert
      Swal.mixin({
        customClass: {
          confirmButton: 'swal-confirm-button',
          cancelButton: 'swal-cancel-button',
          title: 'swal-title',
          content: 'swal-content'
        },
        buttonsStyling: true
      });
    }
  });