document.addEventListener('DOMContentLoaded', () => {
  
  // --- PRELOADER LUXURY PROGRESS ---
  const preloader = document.getElementById('preloader');
  const loaderBarFill = document.getElementById('loader-bar-fill');
  const loaderPercent = document.getElementById('loader-percent');
  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('hidden');
          setTimeout(() => { preloader.style.display = 'none'; }, 800);
        }, 200);
      }
      if (loaderBarFill) loaderBarFill.style.width = `${progress}%`;
      if (loaderPercent) loaderPercent.textContent = `${progress}%`;
    }, 80);
  }

  // --- CUSTOM CURSOR ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  
  if (cursorDot && cursorOutline && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Slight delay for the outline for a smooth trailing effect
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    });

    // Add hover state to links and buttons
    const hoverElements = document.querySelectorAll('a, button, .gallery-item, .service-card, .dot');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorOutline.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorOutline.classList.remove('hover');
      });
    });
  }

  // --- BUTTON RIPPLE EFFECT ---
  const rippleButtons = document.querySelectorAll('.btn, .submit-btn, .ripple-btn');
  rippleButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      this.appendChild(ripple);

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;

      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  });

  // --- SCROLL PROGRESS BAR ---
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    });
  }

  // --- SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.classList.contains('facility-item') || entry.target.classList.contains('mission-item')) {
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
        }
      }
    });
  };

  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  revealElements.forEach(el => revealObserver.observe(el));

  // --- DYNAMIC TYPEWRITER EFFECT ---
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const words = ["Glass Partitions.", "Interior Decoration.", "Gypsum Ceilings.", "Electrical Work.", "Plumbing Solutions."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Faster when deleting
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500; // Pause before new word
      }

      setTimeout(type, typeSpeed);
    }
    
    // Start typing
    setTimeout(type, 1500);
  }

  // --- 3D TILT EFFECT ---
  const tiltCards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth > 768) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        card.style.transition = `transform 0.5s ease`;
      });
      
      card.addEventListener('mouseenter', () => {
        card.style.transition = `none`; // Remove transition during hover for instant tracking
      });
    });
  }

  // --- STICKY HEADER ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- HAMBURGER MENU ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links li a');

  if(hamburger) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      if(hamburger) {
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });

  // --- SMOOTH SCROLLING & ACTIVE LINKS ---
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- GALLERY FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allGalleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      allGalleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- LIGHTBOX GALLERY ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  function getVisibleItems() {
    return Array.from(galleryItems).filter(i => !i.classList.contains('hidden'));
  }

  let currentIndex = 0;

  if (lightbox) {
    function openLightbox(index) {
      currentIndex = index;
      const item = galleryItems[currentIndex];
      
      // Spinner integration
      let loader = document.getElementById('lightbox-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'lightbox-loader';
        loader.className = 'lightbox-loader';
        lightbox.appendChild(loader);
      }
      loader.style.display = 'block';
      lightboxImg.style.opacity = '0';
      
      lightboxImg.src = item.getAttribute('data-src');
      lightboxCaption.textContent = item.getAttribute('data-caption');
      
      lightboxImg.onload = () => {
        loader.style.display = 'none';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transition = 'opacity 0.4s ease';
      };
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    function nextImage(e) {
      if(e) e.stopPropagation();
      const visible = getVisibleItems();
      currentIndex = (currentIndex + 1) % visible.length;
      openLightboxFiltered(visible, currentIndex);
    }

    function prevImage(e) {
      if(e) e.stopPropagation();
      const visible = getVisibleItems();
      currentIndex = (currentIndex - 1 + visible.length) % visible.length;
      openLightboxFiltered(visible, currentIndex);
    }

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const visible = getVisibleItems();
        const idx = visible.indexOf(item);
        if (idx !== -1) openLightboxFiltered(visible, idx);
      });
    });

    function openLightboxFiltered(items, idx) {
      currentIndex = idx;
      const item = items[currentIndex];
      let loader = document.getElementById('lightbox-loader');
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'lightbox-loader';
        loader.className = 'lightbox-loader';
        lightbox.appendChild(loader);
      }
      loader.style.display = 'block';
      lightboxImg.style.opacity = '0';
      lightboxImg.src = item.getAttribute('data-src');
      lightboxCaption.textContent = item.getAttribute('data-caption');
      lightboxImg.onload = () => {
        loader.style.display = 'none';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transition = 'opacity 0.4s ease';
      };
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch Swipe for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) nextImage();
      if (touchEndX > touchStartX + 50) prevImage();
    }
  }

  // --- SEARCH FUNCTIONALITY (Desktop + Mobile) ---
  const contentMap = document.getElementById('content-map');

  function initSearch(inputEl, resultsEl) {
    if (!inputEl || !resultsEl || !contentMap) return;
    const dataItems = Array.from(contentMap.children).map(child => ({
      title: child.getAttribute('data-title'),
      link: child.getAttribute('data-link'),
      text: child.textContent,
      searchStr: (child.getAttribute('data-title') + ' ' + child.textContent).toLowerCase()
    }));
    inputEl.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      resultsEl.innerHTML = '';
      if (query.length < 2) { resultsEl.classList.remove('active'); return; }
      const results = dataItems.filter(item => item.searchStr.includes(query));
      if (results.length > 0) {
        resultsEl.classList.add('active');
        results.forEach(res => {
          const div = document.createElement('div');
          div.className = 'search-result-item';
          div.innerHTML = `<h5>${res.title}</h5><p>${res.text.substring(0, 60)}...</p>`;
          div.addEventListener('click', () => {
            window.location.href = res.link;
            resultsEl.classList.remove('active');
            inputEl.value = '';
          });
          resultsEl.appendChild(div);
        });
      } else {
        resultsEl.classList.add('active');
        resultsEl.innerHTML = '<div class="search-result-item"><p>No results found</p></div>';
      }
    });
  }

  initSearch(
    document.getElementById('desktop-search-input'),
    document.getElementById('desktop-search-results')
  );
  initSearch(
    document.getElementById('mobile-search-input'),
    document.getElementById('mobile-search-results')
  );

  // --- DESKTOP SEARCH TRIGGER TOGGLE ---
  const searchTriggerBtn = document.getElementById('search-trigger-btn');
  const desktopSearchWrapper = document.getElementById('desktop-search-wrapper');
  if (searchTriggerBtn && desktopSearchWrapper) {
    searchTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      desktopSearchWrapper.classList.toggle('active');
      if (desktopSearchWrapper.classList.contains('active')) {
        const dsi = document.getElementById('desktop-search-input');
        if (dsi) dsi.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.desktop-search-container')) {
        desktopSearchWrapper.classList.remove('active');
        const dr = document.getElementById('desktop-search-results');
        if (dr) dr.classList.remove('active');
      }
    });
  }

  // --- CONTACT FORM WHATSAPP INTEGRATION ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const message = document.getElementById('message').value;
      
      const whatsappNumber = "96892903653";
      const whatsappMessage = `Hello Abu Muhammad Azan, I am contacting you from your website.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
      
      // Open WhatsApp in new tab
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
      
      // Redirect to thank you page in current tab
      window.location.href = 'thank-you.html';
    });
  }

  // --- BACK TO TOP BUTTON ---
  const backToTop = document.getElementById('backToTop');
  if(backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- COUNTER UP ANIMATION FOR STATS ---
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      const currentVal = Math.floor(easeProgress * target);
      
      element.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(animate);
  };

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          statNumbers.forEach(num => countUp(num));
          animatedStats = true;
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }

  // --- SKILL PROGRESS BARS ---
  const skillsContainer = document.querySelector('.skills-container');
  const progressLines = document.querySelectorAll('.progress-line span');
  let animatedSkills = false;

  if (skillsContainer && progressLines.length > 0) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedSkills) {
          progressLines.forEach(line => {
            const percent = line.parentElement.getAttribute('data-percent');
            line.style.width = percent;
          });
          animatedSkills = true;
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsContainer);
  }

  // --- QUOTE ROTATOR ---
  const quotesSection = document.getElementById('quotes');
  if (quotesSection) {
    const slides = quotesSection.querySelectorAll('.quote-slide');
    const dots = quotesSection.querySelectorAll('.quote-dots .dot');
    let quoteIndex = 0;
    let quoteInterval = null;

    function showQuote(index) {
      if (index === quoteIndex) return;

      const currentSlide = slides[quoteIndex];
      const nextSlide = slides[index];

      currentSlide.classList.remove('active');
      currentSlide.classList.add('exit');
      nextSlide.classList.add('active');

      dots[quoteIndex].classList.remove('active');
      dots[index].classList.add('active');

      setTimeout(() => {
        currentSlide.classList.remove('exit');
      }, 800);

      quoteIndex = index;
    }

    function startQuoteRotation() {
      quoteInterval = setInterval(() => {
        const nextIndex = (quoteIndex + 1) % slides.length;
        showQuote(nextIndex);
      }, 4000);
    }

    function stopQuoteRotation() {
      if (quoteInterval) clearInterval(quoteInterval);
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopQuoteRotation();
        showQuote(idx);
        startQuoteRotation();
      });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    quotesSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    quotesSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleQuoteSwipe();
    }, { passive: true });

    function handleQuoteSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 50) {
        stopQuoteRotation();
        if (swipeDistance < 0) {
          const nextIndex = (quoteIndex + 1) % slides.length;
          showQuote(nextIndex);
        } else {
          const prevIndex = (quoteIndex - 1 + slides.length) % slides.length;
          showQuote(prevIndex);
        }
        startQuoteRotation();
      }
    }

    startQuoteRotation();
  }

  // --- ENHANCED SCROLL REVEAL SETUP ---
  function setupScrollReveals() {
    const scrollObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          scrollObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    function watch(el, cls, delay) {
      if (!el) return;
      el.classList.add(cls);
      if (delay) el.style.transitionDelay = delay;
      scrollObs.observe(el);
    }

    // About section
    watch(document.querySelector('.about .section-title'), 'reveal-left');
    watch(document.querySelector('.about-text'),          'reveal-right');
    watch(document.querySelector('.about-image'),         'reveal-up');

    // Services section
    watch(document.querySelector('.services .section-title'), 'reveal-down');
    document.querySelectorAll('.service-card').forEach((card, i) =>
      watch(card, 'reveal-up', `${i * 0.2}s`));

    // Stats cards
    document.querySelectorAll('.stat-card').forEach((card, i) =>
      watch(card, 'reveal-up', `${i * 0.15}s`));

    // Facilities section
    watch(document.querySelector('.facilities .section-title'), 'reveal-down');

    // Gallery section
    watch(document.querySelector('.portfolio .section-title'), 'reveal-left');
    document.querySelectorAll('.gallery-item').forEach((item, i) =>
      watch(item, 'reveal-up', `${i * 0.12}s`));

    // Contact section
    watch(document.querySelector('.contact .section-title'), 'reveal-right');
    watch(document.querySelector('.contact-info'),           'reveal-left');
    watch(document.querySelector('.contact-form'),           'reveal-up');

    // Footer
    watch(document.querySelector('footer'), 'reveal-up');
  }
  setupScrollReveals();

  // --- SVG RING ANIMATION ---
  const ringFills = document.querySelectorAll('.ring-fill');
  if (ringFills.length > 0) {
    const ringObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rings = entry.target.querySelectorAll('.ring-fill');
          rings.forEach(ring => {
            const percent = parseFloat(ring.getAttribute('data-percent') || 80);
            const circumference = 2 * Math.PI * 42;
            const offset = circumference - (percent / 100) * circumference;
            ring.style.strokeDasharray = circumference;
            ring.style.strokeDashoffset = offset;
          });
          ringObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.stat-card').forEach(card => ringObs.observe(card));
  }

  // --- STATS ICON ROTATION ON SCROLL ---
  const statIcons = document.querySelectorAll('.stat-icon');
  if (statIcons.length > 0) {
    const iconObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('icon-spin');
          iconObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statIcons.forEach(icon => iconObs.observe(icon));
  }

  // --- QUICK QUOTE PANEL ---
  const qqBtn   = document.getElementById('quickQuoteBtn');
  const qqPanel = document.getElementById('quickQuotePanel');
  const qqClose = document.getElementById('quickQuoteClose');

  if (qqBtn && qqPanel) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (pct > 0.25) {
        qqBtn.classList.add('visible');
      } else {
        qqBtn.classList.remove('visible');
      }
    });

    qqBtn.addEventListener('click', () => {
      qqPanel.classList.toggle('open');
      qqBtn.style.display = qqPanel.classList.contains('open') ? 'none' : 'flex';
    });

    if (qqClose) {
      qqClose.addEventListener('click', () => {
        qqPanel.classList.remove('open');
        qqBtn.style.display = 'flex';
      });
    }

    const qqForm = document.getElementById('quickQuoteForm');
    if (qqForm) {
      qqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = qqForm.querySelectorAll('input, select, textarea');
        const name    = inputs[0].value || 'N/A';
        const phone   = inputs[1].value || 'N/A';
        const service = inputs[2].value || 'General';
        const city    = inputs[3].value || 'N/A';
        const desc    = inputs[4] ? inputs[4].value : '';
        const msg = `Quick Quote Request%0AName: ${name}%0APhone: ${phone}%0AService: ${service}%0ACity: ${city}%0ADescription: ${desc}`;
        window.open(`https://wa.me/96892903653?text=${msg}`, '_blank');
      });
    }
  }

  // --- MAGNETIC BUTTONS ---
  if (window.innerWidth > 768) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.classList.add('btn-magnetic');
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
        btn.style.transform = `translate(${x}px, ${y}px) scale(1.03)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0,0) scale(1)';
      });
    });
  }

  // --- HERO BACKGROUND SLIDESHOW ---
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroSlideDots = document.querySelectorAll('.slide-dot');
  let currentHeroSlide = 0;
  let heroSlideInterval;

  function goToHeroSlide(index) {
    heroSlides[currentHeroSlide].classList.remove('active');
    if (heroSlideDots[currentHeroSlide]) heroSlideDots[currentHeroSlide].classList.remove('active');
    currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides[currentHeroSlide].classList.add('active');
    if (heroSlideDots[currentHeroSlide]) heroSlideDots[currentHeroSlide].classList.add('active');
  }

  if (heroSlides.length > 0) {
    heroSlideInterval = setInterval(() => {
      goToHeroSlide(currentHeroSlide + 1);
    }, 5000);

    heroSlideDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(heroSlideInterval);
        goToHeroSlide(i);
        heroSlideInterval = setInterval(() => {
          goToHeroSlide(currentHeroSlide + 1);
        }, 5000);
      });
    });
  }

});
