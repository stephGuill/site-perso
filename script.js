/* 
===============================================
PORTFOLIO WEBDESIGNER - JAVASCRIPT
===============================================
Auteur: StephGraph
Description: Fonctionnalités interactives et animations
Technologies: JavaScript Vanilla (ES6+)
APIs utilisées: Intersection Observer, localStorage, Service Worker

STRUCTURE DU FICHIER:
1. Variables globales
2. Menu mobile
3. Navigation (scroll spy, sticky header)
4. Animations (compteurs, parallaxe, particules)
5. Portfolio (filtres, modal)
6. Formulaire de contact
7. Effets visuels (curseur, tilt 3D, ripple)
8. Optimisations et accessibilité
===============================================
*/

// ================================
// VARIABLES GLOBALES
// ================================
// Sélection des éléments DOM principaux utilisés dans plusieurs fonctions
// querySelector() = sélectionne le PREMIER élément correspondant au sélecteur CSS
// querySelectorAll() = sélectionne TOUS les éléments correspondants (retourne NodeList)

const navbar = document.querySelector('.navbar'); // Barre de navigation pour effet sticky
const navToggle = document.querySelector('.nav-toggle'); // Bouton burger menu mobile
const navMenu = document.querySelector('.nav-menu'); // Menu de navigation (ul)
const navLinks = document.querySelectorAll('.nav-link'); // Tous les liens du menu (a)
const sections = document.querySelectorAll('section'); // Toutes les sections pour scroll spy
const portfolioItems = document.querySelectorAll('.portfolio-item'); // Projets du portfolio
const filterButtons = document.querySelectorAll('.filter-btn'); // Boutons de filtre portfolio
const modal = document.getElementById('portfolioModal'); // Modal pour détails projet
const modalClose = document.querySelector('.modal-close'); // Bouton fermeture modal
const contactForm = document.getElementById('contactForm'); // Formulaire de contact
const statNumbers = document.querySelectorAll('.stat-number'); // Chiffres des statistiques à animer

// ================================
// EFFET DE CURSEUR PERSONNALISÉ
// ================================
// Remplace le curseur par défaut par un curseur stylisé avec:
// - Un point central qui suit immédiatement la souris
// - Un cercle externe avec animation de suivi retardé (effet smooth)
// - Agrandissement au survol des éléments interactifs
function initCustomCursor() {
    // 1. CRÉATION DU CURSEUR
    const cursor = document.createElement('div'); // Crée une div pour le curseur
    cursor.className = 'custom-cursor'; // Ajoute la classe CSS
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-outline"></div>'; // 2 éléments: point + cercle
    document.body.appendChild(cursor); // Ajoute le curseur au body

    // 2. SÉLECTION DES SOUS-ÉLÉMENTS
    const cursorDot = cursor.querySelector('.cursor-dot'); // Point central (8px)
    const cursorOutline = cursor.querySelector('.cursor-outline'); // Cercle externe (30px)

    // 3. VARIABLES DE POSITION
    let mouseX = 0, mouseY = 0; // Position actuelle de la souris
    let outlineX = 0, outlineY = 0; // Position actuelle du cercle (avec délai)

    // 4. SUIVI DE LA SOURIS
    document.addEventListener('mousemove', (e) => {
        // e.clientX/Y = coordonnées de la souris par rapport à la fenêtre
        mouseX = e.clientX; // Sauvegarde X
        mouseY = e.clientY; // Sauvegarde Y
        // Le point suit immédiatement la souris
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    // 5. ANIMATION FLUIDE POUR LE CERCLE (avec délai)
    function animateOutline() {
        // Formule d'interpolation linéaire (lerp): nouvelle_pos = ancienne_pos + (cible - ancienne_pos) * vitesse
        // 0.15 = vitesse de suivi (plus petit = plus lent)
        outlineX += (mouseX - outlineX) * 0.15; // Calcule nouvelle position X
        outlineY += (mouseY - outlineY) * 0.15; // Calcule nouvelle position Y
        cursorOutline.style.left = outlineX + 'px'; // Applique X
        cursorOutline.style.top = outlineY + 'px'; // Applique Y
        requestAnimationFrame(animateOutline); // Rappelle la fonction à chaque frame (60fps)
    }
    animateOutline(); // Lance l'animation

    // 6. EFFET HOVER SUR ÉLÉMENTS INTERACTIFS
    const interactiveElements = document.querySelectorAll('a, button, .btn, .portfolio-item, .nav-link');
    interactiveElements.forEach(el => {
        // mouseenter = souris entre dans l'élément
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover'); // Ajoute classe pour agrandir le curseur (CSS)
        });
        // mouseleave = souris sort de l'élément
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover'); // Retire classe pour taille normale
        });
    });
}

// ================================
// Effet de particules dans le hero
// ================================
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ================================
// Effet de saisie animée (typing effect)
// ================================
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid rgba(255,255,255,0.7)';
    
    let charIndex = 0;
    
    function type() {
        if (charIndex < text.length) {
            subtitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 500);
        }
    }
    
    setTimeout(type, 1000);
}

// ================================
// Effet de ripple sur les boutons
// ================================
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .filter-btn, .portfolio-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ================================
// Effet de tilt 3D sur les cartes
// ================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.service-card, .skill-item, .portfolio-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ================================
// Progress bar de scroll
// ================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const progressBarFill = progressBar.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBarFill.style.width = scrollPercent + '%';
    });
}

// ================================
// Compteur de statistiques amélioré
// ================================
function enhancedCounters() {
    statNumbers.forEach(counter => {
        counter.style.transition = 'transform 0.3s ease';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counter.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// ================================
// NAVIGATION MOBILE (Menu Burger)
// ================================
// Gère l'ouverture/fermeture du menu sur mobile et tablette
// Le menu burger (3 barres) est visible uniquement en mode responsive

// FONCTION: Basculer l'état du menu (ouvert/fermé)
function toggleMobileMenu() {
    // toggle() = ajoute la classe si absente, retire si présente
    navMenu.classList.toggle('active'); // Active/désactive le menu (slide depuis la droite)
    navToggle.classList.toggle('active'); // Transforme le burger en X
}

// EVENT LISTENER 1: Click sur le bouton burger
navToggle.addEventListener('click', toggleMobileMenu);

// EVENT LISTENER 2: Click sur un lien du menu
// forEach = boucle sur tous les liens du menu
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Quand on clique un lien, on ferme le menu
        navMenu.classList.remove('active'); // Retire classe active du menu
        navToggle.classList.remove('active'); // Remet le burger normal
    });
});

// ================================
// NAVIGATION STICKY & ACTIVE LINKS (Scroll Spy)
// ================================
// Deux fonctionnalités combinées:
// 1. Navbar sticky: change de style au scroll (fond plus opaque)
// 2. Active link: met en surbrillance le lien correspondant à la section visible

function updateNavigation() {
    // ─────────────────────────────────
    // 1. NAVBAR STICKY
    // ─────────────────────────────────
    // window.scrollY = nombre de pixels scrollés depuis le haut
    if (window.scrollY > 100) { // Si on a scrollé plus de 100px
        navbar.classList.add('scrolled'); // Ajoute classe 'scrolled' (fond plus foncé, ombre plus forte)
    } else {
        navbar.classList.remove('scrolled'); // Retire classe si on remonte en haut
    }

    // ─────────────────────────────────
    // 2. ACTIVE LINK (Scroll Spy)
    // ─────────────────────────────────
    // Détermine quelle section est actuellement visible
    let current = ''; // Variable pour stocker l'ID de la section courante
    
    // Boucle sur toutes les sections du site
    sections.forEach(section => {
        const sectionTop = section.offsetTop; // Position top de la section par rapport au document
        const sectionHeight = section.clientHeight; // Hauteur de la section en pixels
        
        // Si on a scrollé jusqu'à cette section (avec marge de 200px)
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id'); // Récupère l'ID (ex: "about", "services")
        }
    });

    // Met à jour les classes 'active' sur les liens
    navLinks.forEach(link => {
        link.classList.remove('active'); // Retire 'active' de tous les liens
        // Si le href du lien correspond à l'ID de la section courante
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active'); // Ajoute 'active' au lien correspondant
        }
    });
}

// ÉCOUTE L'ÉVÉNEMENT SCROLL
// À chaque scroll, la fonction updateNavigation() est appelée
window.addEventListener('scroll', updateNavigation);

// ================================
// Smooth scrolling pour les liens d'ancrage
// ================================
function smoothScroll() {
    navLinks.forEach(link => {
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

smoothScroll();

// ================================
// ANIMATION DES COMPTEURS (Count Up)
// ================================
// Anime les chiffres des statistiques de 0 vers leur valeur finale
// Utilise l'Intersection Observer API pour déclencher uniquement quand visible

function animateCounters() {
    // ─────────────────────────────────
    // 1. CONFIGURATION DE L'OBSERVER
    // ─────────────────────────────────
    const observerOptions = {
        threshold: 0.5, // L'élément doit être visible à 50% (0.5 = 50%)
        rootMargin: '0px 0px -100px 0px' // Marge: déclenche 100px avant que l'élément soit visible
    };

    // ─────────────────────────────────
    // 2. CRÉATION DE L'INTERSECTION OBSERVER
    // ─────────────────────────────────
    // Observer = surveille quand un élément devient visible dans le viewport
    const observer = new IntersectionObserver((entries) => {
        // entries = tableau d'éléments observés qui ont changé de visibilité
        entries.forEach(entry => {
            // isIntersecting = true si l'élément est visible
            if (entry.isIntersecting) {
                const counter = entry.target; // L'élément compteur
                const target = parseInt(counter.getAttribute('data-count')); // Valeur finale (ex: data-count="150")
                let current = 0; // Valeur actuelle du compteur (commence à 0)
                const increment = target / 100; // Incrément à chaque step (divise par 100 pour 100 steps)
                
                // ─────────────────────────────────
                // 3. ANIMATION DU COMPTEUR
                // ─────────────────────────────────
                // setInterval = répète une fonction toutes les X millisecondes
                const timer = setInterval(() => {
                    current += increment; // Augmente la valeur
                    
                    // Si on atteint ou dépasse la cible
                    if (current >= target) {
                        current = target; // Force la valeur exacte
                        clearInterval(timer); // Arrête l'animation
                    }
                    
                    // Met à jour le texte affiché (arrondi à l'entier inférieur)
                    counter.textContent = Math.floor(current);
                }, 20); // Exécute toutes les 20ms (50 fois par seconde)
                
                // Arrête d'observer cet élément (animation ne se déclenche qu'une fois)
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    // ─────────────────────────────────
    // 4. OBSERVATION DES COMPTEURS
    // ─────────────────────────────────
    // Pour chaque élément .stat-number, on active l'observation
    statNumbers.forEach(counter => {
        observer.observe(counter); // Commence à surveiller cet élément
    });
}

// Lance la fonction
animateCounters();

// ================================
// Filtrage du portfolio
// ================================
function initPortfolioFilter() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mettre à jour les boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filtrer les éléments du portfolio
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

// ================================
// Modal du portfolio
// ================================
const projectData = {
    1: {
        title: "Salle de combat mixte Fight Club", 
        description: "Site web responsive pour une salle de sport de combat mixte avec système de réservation en ligne, menu interactif et galerie photos. Le design met l'accent sur la mixité dans les sports de combat.",
        image: "images/Capture d’écran projet 01.png",
        technologies: ["HTML5", "CSS3"],
        liveLink: "https://stephane-guillamo.students-laplateforme.io/salle_de_sport_fight_club/index.html",
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
        technologies: ["HTML5", "SCSS"],
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
    console.log('🔧 Initialisation de la modal...');
    
    // Vérifier que la modal existe
    if (!modal) {
        console.error('❌ Modal introuvable!');
        return;
    }
    console.log('✅ Modal trouvée:', modal);
    
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-project]');
    console.log('🔗 Nombre de liens portfolio trouvés:', portfolioLinks.length);
    
    if (portfolioLinks.length === 0) {
        console.warn('⚠️ Aucun lien portfolio trouvé avec data-project');
        return;
    }
    
    portfolioLinks.forEach((link, index) => {
        console.log(`📌 Lien ${index + 1}:`, link, 'data-project:', link.getAttribute('data-project'));
        
        link.addEventListener('click', (e) => {
            console.log('🖱️ CLIC DÉTECTÉ!', e.target, e.currentTarget);
            e.preventDefault();
            
            let target = e.target;
            let projectLink = target.closest('.portfolio-link[data-project]');
            
            if (!projectLink) {
                console.warn('⚠️ Lien portfolio non trouvé');
                return;
            }
            
            const projectId = projectLink.getAttribute('data-project');
            const project = projectData[projectId];
            
            console.log('✨ Clic sur projet:', projectId, 'depuis élément:', target.tagName);
            
            if (project) {
                openModal(project);
            } else {
                console.error('❌ Projet non trouvé:', projectId);
            }
        });
    });

    // Fermer la modal avec le bouton X
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Fermer la modal en cliquant sur le fond
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openModal(project) {
    console.log('Ouverture modal pour:', project.title); // Debug
    
    // Récupère les éléments de la modal
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalCodeLink = document.getElementById('modalCodeLink');
    const techContainer = document.getElementById('modalTech');
    
    // Vérifie que tous les éléments existent
    if (!modalImage || !modalTitle || !modalDescription || !techContainer) {
        console.error('Éléments de la modal manquants!');
        return;
    }
    
    // Remplit la modal avec les données du projet
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    
    if (modalLiveLink) modalLiveLink.href = project.liveLink;
    if (modalCodeLink) modalCodeLink.href = project.codeLink;
    
    // Ajoute les technologies
    techContainer.innerHTML = '';
    project.technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'tech-tag';
        tag.textContent = tech;
        techContainer.appendChild(tag);
    });
    
    // Affiche la modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Bloque le scroll de la page
    
    console.log('Modal ouverte!'); // Debug
}

function closeModal() {
    console.log('Fermeture modal'); // Debug
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Réactive le scroll de la page
}

// initModal(); sera appelé dans DOMContentLoaded

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
            createConfetti(); // Effet de confettis
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
    console.log('Portfolio WebDesigner - Scripts chargés avec succès ✨');
    
    // Initialiser les animations CSS
    document.body.classList.add('loaded');
    
    // Mettre à jour la navigation initiale
    updateNavigation();
    
    // Initialiser la modal du portfolio
    initModal();
    
    // DEBUG: Capturer TOUS les clics sur la page
    document.addEventListener('click', (e) => {
        console.log('🌍 CLIC GLOBAL détecté sur:', e.target, 'Classes:', e.target.className);
        if (e.target.closest('.portfolio-link')) {
            console.log('👉 Le clic est sur un portfolio-link!');
        }
        if (e.target.closest('.portfolio-overlay')) {
            console.log('👉 Le clic est dans portfolio-overlay!');
        }
    }, true);
    
    // Initialiser les nouveaux effets modernes
    initCustomCursor();
    initParticles();
    initTypingEffect();
    initRippleEffect();
    initTiltEffect();
    initScrollProgress();
    enhancedCounters();
    
    console.log('🎨 Tous les effets visuels sont activés!');
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

// ================================
// Badge de statut disponible
// ================================
function initAvailabilityBadge() {
    const badge = document.createElement('div');
    badge.className = 'availability-badge';
    badge.innerHTML = `
        <span class="badge-dot"></span>
        <span class="badge-text">Disponible pour de nouveaux projets</span>
    `;
    document.body.appendChild(badge);
    
    // Animation d'entrée après 2 secondes
    setTimeout(() => {
        badge.classList.add('show');
    }, 2000);
    
    // Cacher au scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            badge.classList.remove('show');
        } else {
            badge.classList.add('show');
        }
    });
}

// Styles pour le badge
const badgeStyle = document.createElement('style');
badgeStyle.textContent = `
    .availability-badge {
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        padding: 12px 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 998;
        transform: translateX(300px);
        transition: transform 0.5s ease;
        border: 2px solid rgba(16, 185, 129, 0.3);
    }
    
    .availability-badge.show {
        transform: translateX(0);
    }
    
    .badge-dot {
        width: 10px;
        height: 10px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
        box-shadow: 0 0 10px #10b981;
    }
    
    .badge-text {
        font-size: 0.9rem;
        font-weight: 600;
        color: #1e293b;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.2);
            opacity: 0.7;
        }
    }
    
    @media (max-width: 768px) {
        .availability-badge {
            bottom: 80px;
            right: 20px;
            font-size: 0.85rem;
            padding: 10px 16px;
        }
    }
`;
document.head.appendChild(badgeStyle);

// ================================
// Compteur de visites animé
// ================================
function initVisitorCounter() {
    const visitCount = localStorage.getItem('visitCount') || 0;
    const newCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', newCount);
    
    // console.log(`Visite n°${newCount} 🎉`);
}

// ================================
// Effet de particules sur les boutons au clic
// ================================
function initButtonParticles() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('div');
                particle.className = 'click-particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                
                const angle = (Math.PI * 2 * i) / 12;
                const velocity = 50 + Math.random() * 50;
                
                particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
                particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
                
                this.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }
        });
    });
}

// Styles pour les particules
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    .click-particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        animation: particle-burst 1s ease-out forwards;
    }
    
    @keyframes particle-burst {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// ================================
// Effet de confettis lors de l'envoi du formulaire
// ================================
function createConfetti() {
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Styles pour les confettis
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    .confetti {
        position: fixed;
        top: -10px;
        width: 10px;
        height: 10px;
        z-index: 9999;
        animation: confetti-fall linear forwards;
        pointer-events: none;
    }
    
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// ================================
// Effet de parallaxe au scroll pour le hero
// ================================
function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (!heroContent || !heroImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        heroContent.style.transform = `translateY(${rate}px)`;
        heroImage.style.transform = `translateY(${-rate * 0.3}px)`;
    });
}

// ================================
// Animation des icônes de compétences
// ================================
function initSkillIconAnimation() {
    const skillIcons = document.querySelectorAll('.skill-icon, .service-icon');
    
    skillIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    icon.style.animation = 'bounceIn 0.6s ease-out';
                    observer.unobserve(icon);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(icon);
    });
}

// Ajout de l'animation bounceIn
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) rotate(-45deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.1) rotate(5deg);
        }
        70% {
            transform: scale(0.9) rotate(-3deg);
        }
        100% {
            transform: scale(1) rotate(0deg);
        }
    }
`;
document.head.appendChild(style);

// ================================
// Effet de survol pour les liens de navigation
// ================================
function enhanceNavLinks() {
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// ================================
// Loader de page amélioré
// ================================
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p class="loader-text">Chargement de l'expérience...</p>
        </div>
    `;
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 500);
    });
}

// Styles pour le loader
const loaderStyle = document.createElement('style');
loaderStyle.textContent = `
    .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    }
    
    .loader-content {
        text-align: center;
    }
    
    .loader-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }
    
    .loader-text {
        color: #fff;
        font-size: 1.2rem;
        font-weight: 500;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(loaderStyle);

// ================================
// Mise à jour du titre de la page selon la section
// ================================
function updatePageTitle() {
    const originalTitle = document.title;
    
    window.addEventListener('scroll', debounce(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                const sectionName = section.getAttribute('id');
                if (sectionName === 'home') {
                    document.title = originalTitle;
                } else {
                    const sectionTitle = section.querySelector('h2, h1');
                    if (sectionTitle) {
                        document.title = `${sectionTitle.textContent} | Portfolio`;
                    }
                }
            }
        });
    }, 200));
}

// ================================
// Effet de magnétisme sur les boutons
// ================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .filter-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ================================
// Effet de reveal progressif pour les textes
// ================================
function initTextReveal() {
    const textElements = document.querySelectorAll('.hero-title, .section-title, h3');
    
    textElements.forEach(element => {
        const text = element.textContent.trim();
        element.textContent = '';
        element.style.opacity = '1';
        
        const words = text.split(' ');
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            span.style.marginRight = '0.25em'; // Ajouter un espace entre les mots
            element.appendChild(span);
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = entry.target.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

// ================================
// Détection de la vitesse de scroll
// ================================
let lastScrollTop = 0;
let scrollVelocity = 0;

function detectScrollVelocity() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        scrollVelocity = Math.abs(scrollTop - lastScrollTop);
        lastScrollTop = scrollTop;
        
        // Ajuster l'opacité du header selon la vitesse
        const header = document.querySelector('.header');
        if (scrollVelocity > 20) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    });
}

// ================================
// Initialisation complète
// ================================
if (document.readyState === 'loading') {
    initPageLoader();
}

// Ajouter ces initialisations à DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    initHeroParallax();
    initSkillIconAnimation();
    enhanceNavLinks();
    updatePageTitle();
    initMagneticButtons();
    initTextReveal();
    detectScrollVelocity();
    initAvailabilityBadge();
    initVisitorCounter();
    initButtonParticles();
    
    console.log('🚀 Site ultra-moderne chargé avec succès!');
});