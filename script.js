// ========Variables globales=============
// =======================================
const navbar = document.querySelector('.nabar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-links');
const sections = document.querySelectorAll('.section');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('portfolioModal');
const modalClose = document.querySelector('.modal-close');
const contactForm = document.getElementById('contactForm');
const statNumbers = document.querySelectorAll('.stat-number');

// =========Navigation mobile=======
// =================================
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Event listeners pour la navigation mobile
navToggle.addEventListener('click', toggleMobileMenu);

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ====Navigation sticky et active links=====
// ==========================================
function updateNavigation() {
    // Navigation sticky
    if (window.scrolly > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

     // Active navigation links
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

     navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateNavigation);

// =====Smooth scrolling pour les liens d'ancrage
// ==============================================
function soothSchroll() {
    navLinks.forEach( link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) { 
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

        });
    });
}
