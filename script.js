/* ==========================================================================
   SARAH.CM — STRATEGY & CONTENT INTERACTION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. SCROLL PROGRESS BAR
  const scrollProgress = document.getElementById('scrollProgress');
  
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }
  };

  // 2. STICKY NAVBAR & MOBILE MENU TOGGLE
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link, .btn-nav');

  const handleNavbarScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('compact');
    } else {
      navbar.classList.remove('compact');
    }
  };

  // Toggle du Menu Mobile Hamburger
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Fermeture du menu au clic sur un lien
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. INTERSECTION OBSERVER (SCROLL REVEAL & CASCADE ANIMATIONS)
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si l'élément est un groupe, on anime les enfants en cascade (Stagger)
        if (entry.target.classList.contains('reveal-group')) {
          const items = entry.target.querySelectorAll('.reveal-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('is-revealed');
            }, index * 120); // Décalage de 120ms par élément
          });
        } else {
          entry.target.classList.add('is-revealed');
        }
        observer.unobserve(entry.target); // Libère les ressources
      }
    });
  }, revealOptions);

  // Observer les éléments simples et les groupes
  const elementsToReveal = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-group');
  elementsToReveal.forEach(el => revealObserver.observe(el));

  // 4. ANIMATION DES COMPTEURS NUMÉRIQUES (STATS)
  const counters = document.querySelectorAll('.counter');
  let animatedCounters = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 secondes
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  };

  // Déclencher le compteur uniquement quand la section Stats est visible
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedCounters) {
        animateCounters();
        animatedCounters = true;
      }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // 5. ACCORDÉON FAQ INTERACTIF
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Fermer tous les autres éléments FAQ
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.faq-content');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Ouvrir/Fermer l'élément sélectionné
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // 6. MODALE DÉTAILS PROJET (PORTFOLIO)
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  // Données dynamiques des projets pour la Modale
  const projectsData = {
    cosmetique: {
      title: "GlowCare — Skincare Clean",
      client: "Marque Cosmétique Bio",
      challenge: "Augmenter la portée organique et engager une communauté Gen-Z exigeante.",
      solution: "Création d'une série de 20 Reels/TikToks axés sur la transparence des ingrédients et l'UGC.",
      results: ["+18 000 Abonnés ciblés", "+140% de ventes via Instagram", "Taux d'engagement de 8.4%"]
    },
    resto: {
      title: "RestoBar urban — Concept Food",
      client: "Restaurant Gastronomique & Cocktail",
      challenge: "Générer du flux physique en restaurant pendant les jours creux.",
      solution: "Vidéos courtes immersives dans les coulisses des cuisines et concours exclusifs.",
      results: ["3.2M de Vues cumulées sur TikTok", "Réservations complètes sur 2 mois", "+250% de partages"]
    },
    saas: {
      title: "TechFlow — SaaS RH",
      client: "Plateforme B2B de gestion des talents",
      challenge: "Humaniser une offre SaaS complexe et générer des Démos qualifiées.",
      solution: "Stratégie 'Thought Leadership' pour les fondateurs sur LinkedIn et carrousels éducatifs.",
      results: ["+45 Démonstrations par mois", "+300% d'impressions profil", "Positionnement Référence secteur"]
    }
  };

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectKey = card.getAttribute('data-project');
      const data = projectsData[projectKey];

      if (data) {
        modalBody.innerHTML = `
          <span class="tag" style="color:var(--primary); font-weight:700; font-size:0.8rem;">${data.client}</span>
          <h3 style="font-size:1.6rem; margin:0.4rem 0 1rem; color:var(--dark);">${data.title}</h3>
          <p style="margin-bottom:1rem; color:var(--gray-medium);"><strong>Le Défi :</strong> ${data.challenge}</p>
          <p style="margin-bottom:1.5rem; color:var(--gray-medium);"><strong>La Stratégie :</strong> ${data.solution}</p>
          <div style="background:var(--primary-light); padding:1.2rem; border-radius:var(--radius); margin-bottom:1.5rem;">
            <strong style="color:var(--primary); display:block; margin-bottom:0.5rem;">Résultats Clés :</strong>
            <ul style="list-style:none; padding:0;">
              ${data.results.map(r => `<li style="font-size:0.9rem; margin-bottom:0.4rem; color:var(--dark); display:flex; align-items:center; gap:0.5rem;"><i data-lucide="check-circle-2" style="width:16px; color:var(--primary);"></i> ${r}</li>`).join('')}
            </ul>
          </div>
          <a href="#contact" class="btn-primary modal-cta-btn" style="width:100%; text-align:center;">Demander une stratégie similaire</a>
        `;

        lucide.createIcons();
        modalOverlay.classList.add('active');

        // Gestion du CTA dans la modale
        const modalCta = modalBody.querySelector('.modal-cta-btn');
        if (modalCta) {
          modalCta.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
          });
        }
      }
    });
  });

  // Fermeture de la Modale
  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  }

  // 7. GESTION DU FORMULAIRE DE CONTACT & VALIDATION
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const inputs = contactForm.querySelectorAll('input, select, textarea');

      // Validation rapide
      inputs.forEach(input => {
        if (!input.checkValidity()) {
          isValid = false;
          input.parentElement.classList.add('shake');
          setTimeout(() => input.parentElement.classList.remove('shake'), 400);
        }
      });

      if (isValid) {
        // Animation du bouton pendant l'envoi
        submitBtn.classList.add('loading');

        setTimeout(() => {
          submitBtn.classList.remove('loading');
          
          // Feedback de succès
          contactForm.innerHTML = `
            <div style="text-align:center; padding:2rem 1rem;">
              <div style="width:60px; height:60px; background:var(--primary-light); color:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1.2rem;">
                <i data-lucide="check" style="width:32px; height:32px;"></i>
              </div>
              <h3 style="font-size:1.5rem; margin-bottom:0.5rem; color:var(--dark);">Message bien reçu !</h3>
              <p style="color:var(--gray-medium); font-size:0.95rem;">Merci pour votre demande. Je reviens vers vous sous 24h ouvrées pour discuter de votre projet.</p>
            </div>
          `;
          lucide.createIcons();
        }, 1800);
      }
    });
  }

  // 8. ÉCOUTEURS D'ÉVÉNEMENTS GLOBAUX (THROTTLED SCROLL)
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavbarScroll();
  }, { passive: true });

});