// main.js - Interactive elements for the landing page

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
        
        // Reveal elements on scroll
        revealElements();
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
        if (navLinks.classList.contains('active') && 
            !event.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Back to top button
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Animated counter for statistics
    function animateCounter(element, targetValue) {
        let startValue = 0;
        let duration = 2000;
        let startTime = null;
        
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentValue = Math.floor(progress * targetValue);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Sample data for statistics (can be replaced with real data later)
    const mockStats = {
        totalLaporan: 1247,
        laporanDiproses: 328,
        laporanSelesai: 919
    };
    
    // Initialize with mock data
    const totalLaporanElement = document.getElementById('totalLaporan');
    const laporanDiprosesElement = document.getElementById('laporanDiproses');
    const laporanSelesaiElement = document.getElementById('laporanSelesai');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Stats counter animation trigger
    let statsAnimated = false;
    
    function checkStatsVisibility() {
        const statsSection = document.querySelector('.stats-container');
        
        if (statsSection && isInViewport(statsSection) && !statsAnimated) {
            animateCounter(totalLaporanElement, mockStats.totalLaporan);
            animateCounter(laporanDiprosesElement, mockStats.laporanDiproses);
            animateCounter(laporanSelesaiElement, mockStats.laporanSelesai);
            statsAnimated = true;
        }
    }
    
    // Scroll reveal animation
    function revealElements() {
        const elements = document.querySelectorAll('.scroll-reveal');
        
        elements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
        
        // Check if stats section is visible
        checkStatsVisibility();
    }
    
    // Initialize scroll reveal
    revealElements();
    
    // Email subscription form
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email.trim() !== '') {
                // Here you would typically send the email to your backend
                // For now, we'll just show a success message
                
                // Clear the input
                emailInput.value = '';
                
                // Create and show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Terima kasih telah berlangganan!';
                successMessage.style.color = '#4caf50';
                successMessage.style.marginTop = '10px';
                successMessage.style.fontSize = '0.9rem';
                
                // Remove any existing message
                const existingMessage = subscribeForm.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // Add the new message
                subscribeForm.appendChild(successMessage);
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }
    
    // Add subtle parallax effect to the banner
    window.addEventListener('mousemove', function(e) {
        const banner = document.querySelector('.banner');
        if (banner) {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            banner.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hover effect for data cards
    const dataCards = document.querySelectorAll('.data-card');
    
    dataCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.transition = 'all 0.3s ease';
            
            const icon = this.querySelector('.card-header i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'all 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px) scale(1)';
            
            const icon = this.querySelector('.card-header i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
});