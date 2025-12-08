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
// SYSTÈME DE PARTICULES FLOTTANTES
// ================================
// Crée 30 particules animées dans la section hero pour effet visuel dynamique
// Les particules flottent avec des vitesses et positions aléatoires
function initParticles() {
    // 1. SÉLECTION DE LA SECTION HERO
    const hero = document.querySelector('.hero'); // Sélectionne la section d'accueil
    if (!hero) return; // Si hero n'existe pas, sortir de la fonction (sécurité)

    // 2. CRÉATION DU CONTENEUR DE PARTICULES
    const particlesContainer = document.createElement('div'); // Crée une div pour contenir toutes les particules
    particlesContainer.className = 'particles'; // Ajoute classe CSS pour le style
    hero.appendChild(particlesContainer); // Ajoute le conteneur dans la section hero

    // 3. GÉNÉRATION DE 30 PARTICULES
    for (let i = 0; i < 30; i++) { // Boucle de 0 à 29 (30 itérations)
        const particle = document.createElement('div'); // Crée une div pour chaque particule
        particle.className = 'particle'; // Ajoute classe CSS (définit taille, forme, couleur)
        
        // Position horizontale aléatoire de 0% à 100% de la largeur
        particle.style.left = Math.random() * 100 + '%'; // Math.random() génère 0.0 à 0.99999...
        
        // Délai d'animation aléatoire de 0s à 15s (pour décalage du démarrage)
        particle.style.animationDelay = Math.random() * 15 + 's';
        
        // Durée d'animation aléatoire de 15s à 25s (vitesse de montée variable)
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        particlesContainer.appendChild(particle); // Ajoute la particule au conteneur
    }
}

// ================================
// EFFET MACHINE À ÉCRIRE (Typing Effect)
// ================================
// Simule une saisie lettre par lettre du sous-titre avec curseur clignotant
// Comme un terminal ou une machine à écrire vintage
function initTypingEffect() {
    // 1. SÉLECTION DE L'ÉLÉMENT À ANIMER
    const subtitle = document.querySelector('.hero-subtitle'); // Le sous-titre du hero
    if (!subtitle) return; // Protection: sortir si l'élément n'existe pas

    // 2. SAUVEGARDE ET VIDAGE DU TEXTE ORIGINAL
    const text = subtitle.textContent; // Sauvegarde le texte complet (ex: "WebDesigner & Développeur...")
    subtitle.textContent = ''; // Vide le texte pour commencer l'animation
    
    // 3. AJOUT DU CURSEUR CLIGNOTANT
    subtitle.style.borderRight = '2px solid rgba(255,255,255,0.7)'; // Bordure droite = curseur
    
    // 4. INDEX DE CARACTÈRE (position actuelle dans le texte)
    let charIndex = 0; // Commence au premier caractère (index 0)
    
    // 5. FONCTION RÉCURSIVE POUR TAPER CHAQUE LETTRE
    function type() {
        if (charIndex < text.length) { // Si on n'a pas atteint la fin du texte
            // Ajoute le caractère actuel au texte affiché
            subtitle.textContent += text.charAt(charIndex); // charAt(0) = 'W', charAt(1) = 'e', etc.
            charIndex++; // Passe au caractère suivant
            setTimeout(type, 100); // Rappelle type() après 100ms (vitesse de frappe)
        } else { // Fin du texte atteinte
            // Cache le curseur après 500ms
            setTimeout(() => {
                subtitle.style.borderRight = 'none'; // Retire la bordure/curseur
            }, 500);
        }
    }
    
    // 6. DÉMARRAGE DE L'ANIMATION APRÈS 1 SECONDE
    setTimeout(type, 1000); // Attend 1s avant de commencer à taper
}

// ================================
// EFFET RIPPLE (Ondulation au clic)
// ================================
// Crée une ondulation circulaire au point de clic sur les boutons
// Effet similaire au Material Design (Google)
function initRippleEffect() {
    // 1. SÉLECTION DE TOUS LES BOUTONS
    const buttons = document.querySelectorAll('.btn, .filter-btn, .portfolio-link');
    
    // 2. AJOUT DE L'ÉVÉNEMENT CLIC SUR CHAQUE BOUTON
    buttons.forEach(button => {
        button.addEventListener('click', function(e) { // 'this' = bouton cliqué
            // 3. CRÉATION DE L'ÉLÉMENT RIPPLE
            const ripple = document.createElement('span'); // Crée un span pour l'ondulation
            ripple.className = 'ripple-effect'; // Classe CSS avec animation d'expansion
            
            // 4. CALCUL DE LA POSITION ET TAILLE
            const rect = this.getBoundingClientRect(); // Position et dimensions du bouton
            const size = Math.max(rect.width, rect.height); // Prend la plus grande dimension
            
            // Coordonnées du clic par rapport au bouton
            const x = e.clientX - rect.left - size / 2; // Centrage horizontal du ripple
            const y = e.clientY - rect.top - size / 2; // Centrage vertical du ripple
            
            // 5. APPLICATION DU STYLE AU RIPPLE
            ripple.style.width = ripple.style.height = size + 'px'; // Cercle carré (même largeur/hauteur)
            ripple.style.left = x + 'px'; // Position X du centre
            ripple.style.top = y + 'px'; // Position Y du centre
            
            // 6. AJOUT DU RIPPLE AU BOUTON
            this.appendChild(ripple); // Insère le span dans le bouton
            
            // 7. SUPPRESSION APRÈS ANIMATION (600ms)
            setTimeout(() => {
                ripple.remove(); // Retire l'élément du DOM pour éviter accumulation
            }, 600); // Durée = durée de l'animation CSS
        });
    });
}

// ================================
// EFFET TILT 3D AU SURVOL
// ================================
// Fait basculer les cartes en 3D selon la position de la souris
// Crée un effet de profondeur et d'interactivité
function initTiltEffect() {
    // 1. SÉLECTION DE TOUTES LES CARTES
    const cards = document.querySelectorAll('.service-card, .skill-item, .portfolio-item');
    
    // 2. AJOUT DES ÉVÉNEMENTS SUR CHAQUE CARTE
    cards.forEach(card => {
        // ÉVÉNEMENT: Mouvement de la souris sur la carte
        card.addEventListener('mousemove', (e) => {
            // 3. RÉCUPÉRATION DES DIMENSIONS ET POSITION DE LA CARTE
            const rect = card.getBoundingClientRect(); // Position et taille de la carte
            const x = e.clientX - rect.left; // Position X de la souris dans la carte (0 à rect.width)
            const y = e.clientY - rect.top; // Position Y de la souris dans la carte (0 à rect.height)
            
            // 4. CALCUL DU CENTRE DE LA CARTE
            const centerX = rect.width / 2; // Milieu horizontal
            const centerY = rect.height / 2; // Milieu vertical
            
            // 5. CALCUL DES ROTATIONS
            // Si souris en haut (y petit), rotateX négatif = carte penche vers avant
            // Si souris en bas (y grand), rotateX positif = carte penche vers arrière
            const rotateX = (y - centerY) / 10; // Division par 10 = limite l'angle de rotation
            
            // Si souris à gauche (x petit), rotateY positif = carte tourne à droite
            // Si souris à droite (x grand), rotateY négatif = carte tourne à gauche
            const rotateY = (centerX - x) / 10;
            
            // 6. APPLICATION DE LA TRANSFORMATION 3D
            // perspective(1000px) = profondeur de la scène 3D
            // rotateX/Y = rotation en degrés
            // scale3d(1.05) = agrandissement léger de 5%
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        // ÉVÉNEMENT: Souris quitte la carte
        card.addEventListener('mouseleave', () => {
            // 7. RÉINITIALISATION DE LA POSITION (retour à plat)
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ================================
// BARRE DE PROGRESSION DE SCROLL
// ================================
// Affiche une barre colorée en haut de page indiquant le % de scroll
// Se remplit de gauche à droite au fur et à mesure du scroll
function initScrollProgress() {
    // 1. CRÉATION DE LA BARRE DE PROGRESSION
    const progressBar = document.createElement('div'); // Conteneur fixe en haut de page
    progressBar.className = 'scroll-progress'; // Classe CSS (position: fixed, top: 0)
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>'; // Barre intérieure qui s'étend
    document.body.appendChild(progressBar); // Ajout au body
    
    // 2. SÉLECTION DE LA BARRE DE REMPLISSAGE
    const progressBarFill = progressBar.querySelector('.scroll-progress-bar');
    
    // 3. ÉVÉNEMENT DE SCROLL
    window.addEventListener('scroll', () => {
        // 4. CALCUL DE LA POSITION DE SCROLL
        const scrollTop = window.pageYOffset; // Nombre de pixels scrollés depuis le haut (0 au départ)
        
        // 5. CALCUL DE LA HAUTEUR TOTALE SCROLLABLE
        // scrollHeight = hauteur totale du document
        // innerHeight = hauteur de la fenêtre visible
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 6. CALCUL DU POURCENTAGE DE SCROLL
        // scrollPercent = 0% en haut, 100% en bas
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // 7. MISE À JOUR DE LA LARGEUR DE LA BARRE
        progressBarFill.style.width = scrollPercent + '%'; // Applique la largeur en %
    });
}

// ================================
// ANIMATION PULSE SUR LES COMPTEURS
// ================================
// Fait "rebondir" les chiffres des statistiques quand ils deviennent visibles
// Utilise l'Intersection Observer API pour détecter l'entrée dans le viewport
function enhancedCounters() {
    // 1. PARCOURS DE TOUS LES COMPTEURS
    statNumbers.forEach(counter => {
        // 2. AJOUT DE LA TRANSITION CSS
        counter.style.transition = 'transform 0.3s ease'; // Transition fluide pour l'échelle
        
        // 3. CRÉATION D'UN OBSERVATEUR D'INTERSECTION
        // Détecte quand l'élément entre/sort de la zone visible
        const observer = new IntersectionObserver((entries) => {
            // 4. PARCOURS DES ENTRÉES OBSERVÉES
            entries.forEach(entry => {
                // 5. VÉRIFICATION SI L'ÉLÉMENT EST VISIBLE
                if (entry.isIntersecting) { // true = élément visible dans viewport
                    // 6. AGRANDISSEMENT (effet pulse)
                    counter.style.transform = 'scale(1.2)'; // Agrandi à 120%
                    
                    // 7. RETOUR À LA TAILLE NORMALE APRÈS 300ms
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)'; // Retour à 100%
                    }, 300);
                }
            });
        }, { 
            threshold: 0.5 // Options: déclenche quand 50% de l'élément est visible
        });
        
        // 8. DÉMARRAGE DE L'OBSERVATION
        observer.observe(counter); // Commence à surveiller cet élément
    });
}

// ================================
// NAVIGATION MOBILE (Menu Burger)
// ================================
// Gère l'ouverture/fermeture du menu hamburger sur écrans < 768px
// Transforme les 3 barres en X quand le menu est ouvert

// FONCTION: Basculer l'état du menu (ouvert ↔ fermé)
function toggleMobileMenu() {
    // classList.toggle() = ajoute la classe si absente, la retire si présente
    navMenu.classList.toggle('active'); // Active/désactive le menu (slide depuis le haut avec animation)
    navToggle.classList.toggle('active'); // Transforme le burger (☰) en croix (×)
    // CSS: .active anime les 3 barres:
    // - barre du milieu: opacity 0 (disparaît)
    // - barre du haut: rotate(45deg) + translateY
    // - barre du bas: rotate(-45deg) + translateY
}

// ÉCOUTEUR D'ÉVÉNEMENT 1: Clic sur le bouton burger
navToggle.addEventListener('click', toggleMobileMenu); // Ouvre/ferme au clic

// ÉCOUTEUR D'ÉVÉNEMENT 2: Clic sur un lien du menu
// But: Fermer automatiquement le menu après sélection d'une section
navLinks.forEach(link => { // Parcourt tous les liens du menu
    link.addEventListener('click', () => { // Quand on clique sur un lien
        navMenu.classList.remove('active'); // Ferme le menu (retire classe active)
        navToggle.classList.remove('active'); // Remet le burger en forme normale (☰)
        // L'ancre (#about, #services, etc.) fait défiler automatiquement vers la section
    });
});

// ================================
// NAVIGATION STICKY & SCROLL SPY
// ================================
// Deux fonctionnalités essentielles de navigation:
// 1. STICKY NAVBAR: La navbar change d'apparence après un certain scroll
// 2. SCROLL SPY: Le lien actif change selon la section visible à l'écran

function updateNavigation() {
    // ─────────────────────────────────
    // PARTIE 1: NAVBAR STICKY
    // ─────────────────────────────────
    // Objectif: Rendre la navbar plus visible après avoir scrollé
    
    // window.scrollY = nombre de pixels scrollés verticalement depuis le haut de page
    if (window.scrollY > 100) { // Si l'utilisateur a scrollé plus de 100 pixels
        navbar.classList.add('scrolled'); // Ajoute classe CSS 'scrolled'
        // Effet CSS: background plus opaque, box-shadow plus prononcée
    } else { // Si on est en haut de page (scrollY ≤ 100px)
        navbar.classList.remove('scrolled'); // Retire la classe pour style transparent
    }

    // ─────────────────────────────────
    // PARTIE 2: SCROLL SPY (Active Link)
    // ─────────────────────────────────
    // Objectif: Mettre en surbrillance le lien du menu correspondant à la section visible
    
    let current = ''; // Variable pour stocker l'ID de la section actuellement visible
    
    // Parcourt toutes les sections (<section>) du site
    sections.forEach(section => {
        // offsetTop = distance entre le haut de la section et le haut du document
        const sectionTop = section.offsetTop; 
        
        // clientHeight = hauteur de la section en pixels
        const sectionHeight = section.clientHeight; 
        
        // Vérifie si on a scrollé assez pour atteindre cette section
        // Marge de 200px pour anticiper (active le lien avant d'atteindre complètement la section)
        if (window.scrollY >= sectionTop - 200) {
            // getAttribute('id') récupère l'ID de la section (ex: "home", "about", "services")
            current = section.getAttribute('id');
        }
    });

    // Met à jour les classes 'active' sur les liens de navigation
    navLinks.forEach(link => {
        link.classList.remove('active'); // D'abord, retire 'active' de TOUS les liens
        
        // Vérifie si le href de ce lien correspond à la section courante
        // Exemple: si current = "about", cherche le lien avec href="#about"
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active'); // Ajoute 'active' uniquement à ce lien
            // Effet CSS: couleur différente, soulignement, etc.
        }
    });
}

// ─────────────────────────────────
// ACTIVATION DE LA FONCTION AU SCROLL
// ─────────────────────────────────
// Écoute l'événement 'scroll' sur la fenêtre
// À CHAQUE pixel scrollé, updateNavigation() est exécutée
window.addEventListener('scroll', updateNavigation);

// ================================
// DÉFILEMENT FLUIDE (Smooth Scrolling)
// ================================
// Remplace le scroll instantané par une animation fluide lors du clic sur les liens d'ancrage
// Améliore l'expérience utilisateur en rendant la navigation plus douce et professionnelle

function smoothScroll() {
    // Parcourt tous les liens de navigation
    navLinks.forEach(link => {
        // Ajoute un écouteur sur chaque lien
        link.addEventListener('click', (e) => {
            // 1. EMPÊCHE LE COMPORTEMENT PAR DÉFAUT
            e.preventDefault(); // Bloque le scroll instantané natif du navigateur
            
            // 2. RÉCUPÈRE LA CIBLE DU LIEN
            const targetId = link.getAttribute('href'); // Ex: "#about", "#services"
            const targetSection = document.querySelector(targetId); // Sélectionne la section correspondante
            
            // 3. VÉRIFIE QUE LA SECTION EXISTE
            if (targetSection) { // Protection: si la section n'existe pas, ne fait rien
                // 4. DÉFILE VERS LA SECTION AVEC ANIMATION
                targetSection.scrollIntoView({
                    behavior: 'smooth', // Animation fluide au lieu d'instantané
                    block: 'start' // Aligne le haut de la section avec le haut du viewport
                    // Alternatives: 'center' (centre), 'end' (bas), 'nearest' (plus proche)
                });
            }
        });
    });
}

// ─────────────────────────────────
// INITIALISATION DU SMOOTH SCROLL
// ─────────────────────────────────
smoothScroll(); // Active le défilement fluide immédiatement au chargement

// ================================
// ANIMATION DES COMPTEURS (Count Up Effect)
// ================================
// Anime les chiffres des statistiques de 0 jusqu'à leur valeur finale
// L'animation se déclenche uniquement quand les compteurs deviennent visibles
// Utilise Intersection Observer API pour optimiser les performances

function animateCounters() {
    // ─────────────────────────────────
    // ÉTAPE 1: CONFIGURATION DE L'OBSERVER
    // ─────────────────────────────────
    const observerOptions = {
        threshold: 0.5, // Déclenche quand 50% de l'élément est visible (0 = dès qu'il apparaît, 1 = complètement visible)
        rootMargin: '0px 0px -100px 0px' // Marges: top right bottom left
        // -100px en bas = déclenche 100px AVANT que l'élément soit visible (anticipation)
    };

    // ─────────────────────────────────
    // ÉTAPE 2: CRÉATION DE L'INTERSECTION OBSERVER
    // ─────────────────────────────────
    // IntersectionObserver = API native qui surveille la visibilité d'éléments dans le viewport
    const observer = new IntersectionObserver((entries) => {
        // Callback appelé quand la visibilité d'un élément observé change
        // entries = tableau contenant tous les éléments dont la visibilité a changé
        
        entries.forEach(entry => {
            // entry.isIntersecting = true si l'élément est entré dans le viewport
            // entry.isIntersecting = false si l'élément est sorti du viewport
            if (entry.isIntersecting) { // Si le compteur est maintenant visible
                const counter = entry.target; // L'élément HTML du compteur (span.stat-number)
                
                // Récupère la valeur finale depuis l'attribut data-count
                // HTML: <span class="stat-number" data-count="150">0</span>
                const target = parseInt(counter.getAttribute('data-count')); // Ex: 150
                
                let current = 0; // Valeur de départ (0)
                const increment = target / 100; // Incrément par step (ex: 150/100 = 1.5 par step)
                // 100 steps = animation fluide
                
                // ─────────────────────────────────
                // ÉTAPE 3: ANIMATION DU COMPTEUR
                // ─────────────────────────────────
                // setInterval() = exécute une fonction à intervalles réguliers
                const timer = setInterval(() => {
                    current += increment; // Ajoute l'incrément à chaque itération
                    
                    // Vérifie si on a atteint ou dépassé la valeur cible
                    if (current >= target) {
                        current = target; // Force la valeur exacte finale
                        clearInterval(timer); // Arrête le timer (arrête l'animation)
                    }
                    
                    // Met à jour le texte visible dans le compteur
                    // Math.floor() = arrondit à l'entier inférieur (149.7 → 149)
                    counter.textContent = Math.floor(current);
                }, 20); // Répète toutes les 20 millisecondes (50 fois par seconde = 50 FPS)
                // Total: 100 steps × 20ms = 2000ms = 2 secondes d'animation
                
                // ─────────────────────────────────
                // ÉTAPE 4: ARRÊT DE L'OBSERVATION
                // ─────────────────────────────────
                // unobserve() = arrête la surveillance de cet élément
                // Empêche l'animation de se relancer si on rescroll vers cette section
                observer.unobserve(counter);
            }
        });
    }, observerOptions); // Options passées à l'observer

    // ─────────────────────────────────
    // ÉTAPE 5: DÉMARRAGE DE L'OBSERVATION
    // ─────────────────────────────────
    // Parcourt tous les compteurs et démarre leur surveillance
    statNumbers.forEach(counter => {
        observer.observe(counter); // Active l'observation pour cet élément
        // L'animation se déclenchera automatiquement quand il deviendra visible
    });
}

// ─────────────────────────────────
// LANCEMENT DE LA FONCTION
// ─────────────────────────────────
animateCounters(); // Initialise les observateurs immédiatement

// ================================
// SYSTÈME DE FILTRAGE DU PORTFOLIO
// ================================
// Permet de filtrer les projets par catégorie (Tous, Sites Web, Applications, etc.)
// Avec animations de transition lors du changement de filtre

function initPortfolioFilter() {
    // Parcourt tous les boutons de filtre
    filterButtons.forEach(button => {
        // Ajoute un écouteur de clic sur chaque bouton
        button.addEventListener('click', () => {
            // ─────────────────────────────────
            // ÉTAPE 1: MISE À JOUR DES BOUTONS ACTIFS
            // ─────────────────────────────────
            // Retire la classe 'active' de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajoute 'active' uniquement au bouton cliqué (style différent en CSS)
            button.classList.add('active');

            // ─────────────────────────────────
            // ÉTAPE 2: RÉCUPÉRATION DU FILTRE
            // ─────────────────────────────────
            // Lit l'attribut data-filter du bouton cliqué
            // Ex: <button data-filter="web">Sites Web</button> → filter = "web"
            const filter = button.getAttribute('data-filter');

            // ─────────────────────────────────
            // ÉTAPE 3: FILTRAGE DES PROJETS
            // ─────────────────────────────────
            // Parcourt tous les éléments du portfolio
            portfolioItems.forEach(item => {
                // Récupère la catégorie de chaque projet
                // Ex: <div class="portfolio-item" data-category="web">
                const category = item.getAttribute('data-category');
                
                // ─────────────────────────────────
                // CONDITION: AFFICHER OU MASQUER ?
                // ─────────────────────────────────
                if (filter === 'all' || category === filter) {
                    // CAS 1: Filtre "Tous" OU catégorie correspond au filtre
                    item.classList.remove('hide'); // Retire classe hide (animation fade-in en CSS)
                    item.style.display = 'block'; // Affiche l'élément (visible)
                } else {
                    // CAS 2: Catégorie ne correspond pas au filtre
                    item.classList.add('hide'); // Ajoute classe hide (animation fade-out en CSS)
                    
                    // Délai avant de masquer complètement (laisse le temps à l'animation CSS)
                    setTimeout(() => {
                        item.style.display = 'none'; // Masque l'élément (retire de la mise en page)
                    }, 300); // 300ms = durée de l'animation CSS de fade-out
                }
            });
        });
    });
}

// ─────────────────────────────────
// INITIALISATION DU FILTRE
// ─────────────────────────────────
initPortfolioFilter(); // Active le système de filtrage dès le chargement

// ================================
// BASE DE DONNÉES DES PROJETS
// ================================
// Objet contenant toutes les informations détaillées de chaque projet
// Structure: ID du projet → { propriétés du projet }
// Ces données sont utilisées pour remplir la modal quand on clique sur "Voir le projet"

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

// ================================
// INITIALISATION DU SYSTÈME DE MODAL
// ================================
// Configure tous les événements pour ouvrir/fermer la modal des projets
// La modal affiche les détails complets d'un projet (image, description, technologies, liens)

function initModal() {
    console.log('🔧 Initialisation de la modal...'); // Log de débogage
    
    // ─────────────────────────────────
    // ÉTAPE 1: VÉRIFICATIONS DE SÉCURITÉ
    // ─────────────────────────────────
    // Vérifie que l'élément modal existe dans le DOM
    if (!modal) { // Si modal est null ou undefined
        console.error('❌ Modal introuvable!'); // Affiche erreur dans la console
        return; // Sort de la fonction (arrête l'exécution)
    }
    console.log('✅ Modal trouvée:', modal); // Confirmation que la modal existe
    
    // ─────────────────────────────────
    // ÉTAPE 2: SÉLECTION DES LIENS PORTFOLIO
    // ─────────────────────────────────
    // Sélectionne tous les liens avec data-project (icônes œil dans le portfolio)
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-project]');
    console.log('🔗 Nombre de liens portfolio trouvés:', portfolioLinks.length);
    
    // Vérification: s'il n'y a aucun lien, sortir de la fonction
    if (portfolioLinks.length === 0) {
        console.warn('⚠️ Aucun lien portfolio trouvé avec data-project');
        return; // Pas de liens = pas besoin de continuer
    }
    
    // ─────────────────────────────────
    // ÉTAPE 3: AJOUT DES ÉVÉNEMENTS DE CLIC
    // ─────────────────────────────────
    // Parcourt chaque lien et ajoute un écouteur de clic
    portfolioLinks.forEach((link, index) => {
        console.log(`📌 Lien ${index + 1}:`, link, 'data-project:', link.getAttribute('data-project'));
        
        // Événement: Clic sur le lien (ou sur l'icône à l'intérieur)
        link.addEventListener('click', (e) => {
            console.log('🖱️ CLIC DÉTECTÉ!', e.target, e.currentTarget); // Debug
            e.preventDefault(); // Empêche la navigation par défaut (href="#")
            
            // ─────────────────────────────────
            // GESTION DU CLIC SUR ICÔNE ENFANT
            // ─────────────────────────────────
            // Problème: Si on clique sur l'icône <i>, e.target = <i> et non <a>
            // Solution: Remonter au parent .portfolio-link avec closest()
            let target = e.target; // Élément réellement cliqué (peut être <i> ou <a>)
            let projectLink = target.closest('.portfolio-link[data-project]'); // Remonte au lien parent
            
            // Vérification: le lien parent existe-t-il ?
            if (!projectLink) {
                console.warn('⚠️ Lien portfolio non trouvé');
                return; // Sort si problème
            }
            
            // ─────────────────────────────────
            // RÉCUPÉRATION DES DONNÉES DU PROJET
            // ─────────────────────────────────
            const projectId = projectLink.getAttribute('data-project'); // Ex: "1", "2", "3"
            const project = projectData[projectId]; // Récupère l'objet du projet dans projectData
            
            console.log('✨ Clic sur projet:', projectId, 'depuis élément:', target.tagName);
            
            // Vérification: le projet existe-t-il dans projectData ?
            if (project) {
                openModal(project); // Ouvre la modal avec les données du projet
            } else {
                console.error('❌ Projet non trouvé:', projectId); // Erreur si ID invalide
            }
        });
    });

    // ─────────────────────────────────
    // ÉTAPE 4: ÉVÉNEMENTS DE FERMETURE
    // ─────────────────────────────────
    
    // MÉTHODE 1: Fermer avec le bouton X
    if (modalClose) { // Vérifie que le bouton existe
        modalClose.addEventListener('click', closeModal); // Clic sur X → ferme la modal
    }
    
    // MÉTHODE 2: Fermer en cliquant sur le fond sombre (overlay)
    modal.addEventListener('click', (e) => {
        // e.target = élément exact cliqué
        // modal = la div.modal (overlay + contenu)
        if (e.target === modal) { // Si clic directement sur le fond (pas sur le contenu)
            closeModal(); // Ferme la modal
        }
        // Si clic sur modal-content, e.target !== modal, donc ne ferme pas
    });

    // MÉTHODE 3: Fermer avec la touche Échap (Escape)
    document.addEventListener('keydown', (e) => {
        // e.key = la touche pressée (ex: "Escape", "Enter", "a")
        // Condition: touche Escape ET modal actuellement affichée
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal(); // Ferme la modal
        }
    });
}

// ================================
// OUVERTURE DE LA MODAL
// ================================
// Remplit la modal avec les données d'un projet et l'affiche
// Paramètre: project = objet contenant toutes les infos du projet

function openModal(project) {
    console.log('Ouverture modal pour:', project.title); // Log de débogage
    
    // ─────────────────────────────────
    // ÉTAPE 1: SÉLECTION DES ÉLÉMENTS DOM
    // ─────────────────────────────────
    // Récupère tous les éléments de la modal qui doivent être remplis
    const modalImage = document.getElementById('modalImage'); // Image du projet
    const modalTitle = document.getElementById('modalTitle'); // Titre h3
    const modalDescription = document.getElementById('modalDescription'); // Description p
    const modalLiveLink = document.getElementById('modalLiveLink'); // Bouton "Voir le site"
    const modalCodeLink = document.getElementById('modalCodeLink'); // Bouton "Code source"
    const techContainer = document.getElementById('modalTech'); // Container des badges technologies
    
    // ─────────────────────────────────
    // ÉTAPE 2: VÉRIFICATION DE SÉCURITÉ
    // ─────────────────────────────────
    // Vérifie que tous les éléments essentiels existent
    if (!modalImage || !modalTitle || !modalDescription || !techContainer) {
        console.error('Éléments de la modal manquants!'); // Erreur si élément manquant
        return; // Sort de la fonction (n'ouvre pas la modal)
    }
    
    // ─────────────────────────────────
    // ÉTAPE 3: REMPLISSAGE DES DONNÉES
    // ─────────────────────────────────
    
    // IMAGE
    modalImage.src = project.image; // Change la source de l'image (ex: "images/projet01.png")
    modalImage.alt = project.title; // Ajoute texte alternatif pour accessibilité
    
    // TITRE
    modalTitle.textContent = project.title; // Change le texte du titre (ex: "Fight Club")
    
    // DESCRIPTION
    modalDescription.textContent = project.description; // Change le texte de la description
    
    // LIENS (avec vérification d'existence)
    if (modalLiveLink) modalLiveLink.href = project.liveLink; // Lien vers le site en ligne
    if (modalCodeLink) modalCodeLink.href = project.codeLink; // Lien vers le code source (GitHub)
    
    // ─────────────────────────────────
    // ÉTAPE 4: GÉNÉRATION DES BADGES DE TECHNOLOGIES
    // ─────────────────────────────────
    // TECHNOLOGIES (array)
    // project.technologies = ["HTML5", "CSS3", "JavaScript"]
    
    techContainer.innerHTML = ''; // Vide le conteneur (retire les anciennes technologies)
    
    // Parcourt chaque technologie et crée un badge
    project.technologies.forEach(tech => {
        const tag = document.createElement('span'); // Crée un span pour chaque techno
        tag.className = 'tech-tag'; // Classe CSS (badge style pill)
        tag.textContent = tech; // Texte du badge (ex: "React")
        techContainer.appendChild(tag); // Ajoute le badge au conteneur
    });
    // Résultat HTML: <span class="tech-tag">React</span><span class="tech-tag">Node.js</span>...
    
    // ─────────────────────────────────
    // ÉTAPE 5: AFFICHAGE DE LA MODAL
    // ─────────────────────────────────
    modal.style.display = 'block'; // Affiche la modal (passe de display:none à display:block)
    document.body.style.overflow = 'hidden'; // Bloque le scroll de la page principale
    // Empêche de scroller en arrière-plan pendant que la modal est ouverte
    
    console.log('Modal ouverte!'); // Confirmation dans la console
}

// ================================
// FERMETURE DE LA MODAL
// ================================
// Cache la modal et réactive le scroll de la page

function closeModal() {
    console.log('Fermeture modal'); // Log de débogage
    modal.style.display = 'none'; // Cache la modal (display: none)
    document.body.style.overflow = 'auto'; // Réactive le scroll de la page principale
    // Permet de nouveau de scroller la page normalement
}

// initModal(); sera appelé dans DOMContentLoaded

// ================================
// GESTION DU FORMULAIRE DE CONTACT
// ================================
// Gère l'envoi du formulaire avec validation, feedback visuel et notification
// Utilise async/await pour simuler un envoi asynchrone

function initContactForm() {
    // Ajoute un écouteur sur la soumission du formulaire
    contactForm.addEventListener('submit', async (e) => {
        // ─────────────────────────────────
        // ÉTAPE 1: EMPÊCHER LA SOUMISSION NORMALE
        // ─────────────────────────────────
        e.preventDefault(); // Empêche le rechargement de la page (comportement par défaut)
        
        // ─────────────────────────────────
        // ÉTAPE 2: RÉCUPÉRATION DES DONNÉES
        // ─────────────────────────────────
        const formData = new FormData(contactForm); // Crée un objet FormData avec toutes les valeurs
        // formData contient: name, email, subject, message
        
        const submitButton = contactForm.querySelector('button[type="submit"]'); // Sélectionne le bouton
        const originalText = submitButton.innerHTML; // Sauvegarde le texte original du bouton
        
        // ─────────────────────────────────
        // ÉTAPE 3: ÉTAT DE CHARGEMENT
        // ─────────────────────────────────
        // Change l'apparence du bouton pendant l'envoi
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...'; // Icône spinner qui tourne
        submitButton.disabled = true; // Désactive le bouton (empêche double clic)
        
        try {
            // ─────────────────────────────────
            // ÉTAPE 4: ENVOI DES DONNÉES
            // ─────────────────────────────────
            // SIMULATION d'envoi avec délai de 2 secondes
            // EN PRODUCTION: Remplacer par fetch() vers API ou backend
            await new Promise(resolve => setTimeout(resolve, 2000)); // Attend 2 secondes
            
            // Exemple de vrai envoi (à décommenter et adapter):
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     body: formData
            // });
            // if (!response.ok) throw new Error('Erreur serveur');
            
            // ─────────────────────────────────
            // ÉTAPE 5: SUCCÈS
            // ─────────────────────────────────
            showNotification('Message envoyé avec succès !', 'success'); // Notification verte
            createConfetti(); // Effet de confettis festif
            contactForm.reset(); // Vide tous les champs du formulaire
            
        } catch (error) {
            // ─────────────────────────────────
            // ÉTAPE 6: ERREUR
            // ─────────────────────────────────
            showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error'); // Notification rouge
            console.error('Erreur:', error); // Log l'erreur dans la console
            
        } finally {
            // ─────────────────────────────────
            // ÉTAPE 7: RESTAURATION DU BOUTON
            // ─────────────────────────────────
            // finally = exécuté TOUJOURS (succès OU erreur)
            submitButton.innerHTML = originalText; // Remet le texte original
            submitButton.disabled = false; // Réactive le bouton
        }
    });
}

// ================================
// SYSTÈME DE NOTIFICATIONS (Toast)
// ================================
// Affiche des notifications temporaires en haut à droite de l'écran
// Type: 'success' (vert) ou 'error' (rouge)

function showNotification(message, type) {
    // ─────────────────────────────────
    // ÉTAPE 1: CRÉATION DE L'ÉLÉMENT
    // ─────────────────────────────────
    const notification = document.createElement('div'); // Crée une div pour la notification
    notification.className = `notification ${type}`; // Classes: notification success OU notification error
    
    // Contenu HTML avec icône Font Awesome + message
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    // Icône: ✓ pour succès, ! pour erreur
    
    // ─────────────────────────────────
    // ÉTAPE 2: STYLES INLINE
    // ─────────────────────────────────
    // Object.assign() = applique plusieurs propriétés CSS en une fois
    Object.assign(notification.style, {
        position: 'fixed', // Position fixe (ne scroll pas)
        top: '20px', // 20px depuis le haut
        right: '20px', // 20px depuis la droite
        background: type === 'success' ? '#00b894' : '#e17055', // Vert si succès, rouge si erreur
        color: 'white', // Texte blanc
        padding: '1rem 1.5rem', // Espacement intérieur
        borderRadius: '8px', // Coins arrondis
        display: 'flex', // Flexbox pour aligner icône + texte
        alignItems: 'center', // Centre verticalement
        gap: '0.5rem', // Espace entre icône et texte
        zIndex: '9999', // Au-dessus de tout
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', // Ombre portée
        transform: 'translateX(100%)', // Commence hors écran (à droite)
        transition: 'transform 0.3s ease' // Transition fluide pour l'animation
    });
    
    // ─────────────────────────────────
    // ÉTAPE 3: AJOUT AU DOM
    // ─────────────────────────────────
    document.body.appendChild(notification); // Ajoute la notification à la page
    
    // ─────────────────────────────────
    // ÉTAPE 4: ANIMATION D'ENTRÉE
    // ─────────────────────────────────
    // Attend 100ms puis slide depuis la droite
    setTimeout(() => {
        notification.style.transform = 'translateX(0)'; // Ramène à sa position normale
    }, 100); // Petit délai pour que la transition CSS fonctionne
    
    // ─────────────────────────────────
    // ÉTAPE 5: SUPPRESSION AUTOMATIQUE
    // ─────────────────────────────────
    // Après 3 secondes, slide vers la droite et supprime
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)'; // Slide vers la droite (hors écran)
        
        // Attend la fin de l'animation avant de supprimer du DOM
        setTimeout(() => {
            if (notification.parentNode) { // Vérifie que l'élément est toujours dans le DOM
                notification.parentNode.removeChild(notification); // Supprime l'élément
            }
        }, 300); // 300ms = durée de la transition
    }, 3000); // 3000ms = 3 secondes d'affichage
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