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

function initModal() {
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-project]');
    
    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                openModal(project);
            }
        });
    });

    // Fermer la modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal(project) {
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalLiveLink').href = project.liveLink;
    document.getElementById('modalCodeLink').href = project.codeLink;
    
    // Technologies
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = '';
    project.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

initModal();

// ================================
// Formulaire de contact
// ================================
function initContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Désactiver le bouton et montrer le loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;
        
        try {
            // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Succès
            showNotification('Message envoyé avec succès !', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Erreur
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            // Restaurer le bouton
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles inline pour la notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#00b894' : '#e17055',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: '9999',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

initContactForm();

// ================================
// Animations au scroll
// ================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec la classe fade-in
    const fadeElements = document.querySelectorAll('.skill-item, .service-card, .portfolio-item, .contact-item');
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

initScrollAnimations();

// ================================
// Bouton retour en haut
// ================================
function initScrollToTop() {
    // Créer le bouton
    const scrollTopButton = document.createElement('button');
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopButton.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(scrollTopButton);

    // Afficher/masquer le bouton selon la position de scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });

    // Action de retour en haut
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

initScrollToTop();

// ================================
// Parallax pour les éléments flottants
// ================================
function initParallax() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatingIcons.forEach((icon, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            icon.style.transform = `translateY(${rate}px)`;
        });
    });
}

initParallax();

// ================================
// Préloader
// ================================
function initPreloader() {
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
}

initPreloader();

// ================================
// Détection du thème système
// ================================
function initThemeDetection() {
    // Détection du thème sombre (optionnel pour future implémentation)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme(e) {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    prefersDarkScheme.addEventListener('change', updateTheme);
    updateTheme(prefersDarkScheme);
}

// ================================
// Optimisation des performances
// ================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimiser le scroll avec debounce
const optimizedScrollHandler = debounce(updateNavigation, 10);
window.addEventListener('scroll', optimizedScrollHandler);

// ================================
// Lazy loading des images
// ================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

initLazyLoading();

// ================================
// Gestion des erreurs
// ================================
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
});

// ================================
// Initialisation au chargement de la page
// ================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio WebDesigner - Scripts chargés avec succès');
    
    // Initialiser les animations CSS
    document.body.classList.add('loaded');
    
    // Mettre à jour la navigation initiale
    updateNavigation();
});

// ================================
// Service Worker pour la mise en cache (PWA)
// ================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ================================
// Analytics (Google Analytics ou autre)
// ================================
function trackEvent(action, category, label) {
    // Implémentation du tracking d'événements
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Tracker les clics sur les projets
document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('click', 'portfolio', 'project_view');
    });
});

// Tracker les soumissions de formulaire
contactForm.addEventListener('submit', () => {
    trackEvent('submit', 'contact', 'form_submission');
});

// ================================
// Accessibilité
// ================================
function initAccessibility() {
    // Gestion de la navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Améliorer le contraste au focus
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

initAccessibility();

