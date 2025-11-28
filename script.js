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

smoothSchroll();

// =====Animation des compteurs====
// ================================
function animateCounters() {
    const observOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current => target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current);
                }, 20);
                observer.unobserve(counter);
            }
        });
    }, observerOption);

    statNumbers.forEach(counter => {
        observer.observe(counter);
    });
} 

animateCounters();

// ====Filtrage du portfolio====
// =============================
function initPortfolioFilter() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mettre à jour les bouttons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filtrer les éléments du porfolio
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hide');
                     item.style.display = 'block';
                } else {
                    item.classList.add('hide');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);

                }

            });

        });
    });
}

initPortfolioFilter();

// ====Modal du portfolio====
// ==========================
const projectData = {
    1: {
        title: "Salle combat mixte Fight Club",
        description: "Site web responsive pour une salle de sport de combat mixte avec système de réservation en ligne, menu interactif et galerie photos. Le design met l'accent sur la mixité dans les sports de combat. ",
        image: "images/Capture d’écran projet 01.png",
        technologies: ["HTML5", "CSS3","JavaScript"],
        liveLink: "https://stephane-guillamo.students-laplateforme.io/Salle_de_sport_%20Fight%20Club/index.html",
        codeLink: "#"
    },
    2: {
        title: "Whatsapp",
        description: "Application web de gestion de messagerie avec tableau de bord en temps réel, notifications push et collaboration en temps réel. Interface intuitive et fonctionnalités avancées.",
        image: "images/Capture décran projet 05.png",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Express"],
        liveLink: "http://localhost/app-favorites/whatsapp.html",
        codeLink: "#"
    },
    3: {
        title: "Boutique FashionStyle",
        description: "E-commerce moderne pour une boutique de mode pour homme avec panier intelligent, paiement sécurisé, gestion des stocks en temps réel et recommandations personnalisées.",
        image: "images/Capture décran projet 07.png",
        technologies: ["Vue.js", "Laravel", "Stripe", "Redis", "Docker"],
        liveLink: "http://localhost/FashionStyle/shop.html",
        codeLink: "#"
    },
    4: {
        title: "Agence de voyage",
        description: "Site vitrine élégant pour une agence de voyage avec galerie de photos souvenirs de voyageurs, présentation des services et formulaire de contact avancé.",
        image: "images/Capture d’écran projet 03.png",
        technologies: ["HTML5", "SCSS", "JavaScript", "GSAP", "WordPress"],
        liveLink: "https://stephane-guillamo.students-laplateforme.io/voyage/index.html",
        codeLink: "#"
    },
    5: {
        title: "Brain Brending",
        description: "Identité visuelle complète pour un label de musique techno incluant logo, charte graphique, site web et supports de communication print et digital.",
        image: "images/Capture décran projet 04.png",
        technologies: ["Adobe Creative Suite", "Figma", "HTML5", "CSS3"],
        liveLink: "#",
        codeLink: "#"
    },
    6: {
        title: "Spotify",
        description: "Application de musique, découvrez, écoutez et partagez des millions de titres gratuitement. Spotify vous donne un accès instantané à un monde de musique, podcasts et vidéos provenant d'artistes du monde entier..",
        image: "images/Capture décran projet 08.png",
        technologies: ["PWA", "JavaScript", "API REST", "Service Workers"],
        liveLink: "http://localhost/app-favorites/spotify.html",
        codeLink: "#"
    }
};