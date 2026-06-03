const originalNav = document.querySelector('nav');

if (originalNav) {
  // 1. Vytvoření klonu navigace pro sticky chování
  const clonedNav = originalNav.cloneNode(true);
  clonedNav.classList.add('nav--clone');
  document.body.appendChild(clonedNav);

  // 2. Sticky nav behavior (aplikováno pouze na klon)
  const handleScroll = () => {
    if (window.scrollY > 120) {
      clonedNav.classList.add('nav--sticky');
      
      // Zavřít původní menu při scrollování dolů
      originalNav.classList.remove('nav--menu-open');
      const originalBtn = originalNav.querySelector('.menu-btn-mobile');
      if (originalBtn) originalBtn.classList.remove('is-active');
    } else {
      clonedNav.classList.remove('nav--sticky');
      clonedNav.classList.remove('nav--menu-open'); // zavřít menu, pokud se vrátíme nahoru
      
      const btn = clonedNav.querySelector('.menu-btn-mobile');
      if (btn) btn.classList.remove('is-active');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobilní menu logika (musí fungovat na obou navigacích)
  const setupMobileMenu = (navElement) => {
    const btn = navElement.querySelector('.menu-btn-mobile');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        navElement.classList.toggle('nav--menu-open');
        btn.classList.toggle('is-active');
      });
    }
  };

  setupMobileMenu(originalNav);
  setupMobileMenu(clonedNav);

  // Závření menu při kliknutí mimo
  document.addEventListener('click', (e) => {
    [originalNav, clonedNav].forEach(navElement => {
      const btn = navElement.querySelector('.menu-btn-mobile');
      if (navElement.classList.contains('nav--menu-open') && !navElement.contains(e.target)) {
        navElement.classList.remove('nav--menu-open');
        if (btn) btn.classList.remove('is-active');
      }
    });
  });
}

// Experiences Slider logic
document.addEventListener('DOMContentLoaded', () => {
  const sliderWrapper = document.querySelector('.experiences__slider-wrapper');
  const btnPrev = document.querySelector('.experiences__btn-prev');
  const btnNext = document.querySelector('.experiences__btn-next');

  if (sliderWrapper && btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      // Find the first card to get its current dynamic width
      const firstCard = sliderWrapper.querySelector('.experience-card');
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24; // Card width + gap
        sliderWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    });

    btnNext.addEventListener('click', () => {
      const firstCard = sliderWrapper.querySelector('.experience-card');
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24; // Card width + gap
        sliderWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });
  }
});

// Hero Background Slider Logic
document.addEventListener('DOMContentLoaded', () => {
  const heroBgImage = document.getElementById('hero-bg-image');
  const heroBtnPrev = document.getElementById('hero-btn-prev');
  const heroBtnNext = document.getElementById('hero-btn-next');

  if (heroBgImage && heroBtnPrev && heroBtnNext) {
    const images = [
      '/assets/images/context-images/hero-bg.png',
      '/assets/images/context-images/hero-bg-jizerky.png',
      '/assets/images/context-images/bg_hero-skalni-mesta.png'
    ];
    let currentIndex = 0;

    heroBgImage.style.transition = 'opacity 0.3s ease-in-out';
    const heroLinkWinter = document.getElementById('hero-link-winter');
    
    if (heroLinkWinter) {
      heroLinkWinter.style.transition = 'color 0.3s ease-in-out';
    }

    const updateImage = (index) => {
      heroBgImage.style.opacity = 0;
      if (heroLinkWinter) {
        heroLinkWinter.style.color = (index === 0) ? '' : 'white';
      }
      setTimeout(() => {
        heroBgImage.src = images[index];
        heroBgImage.style.opacity = 1;
      }, 300);
    };

    heroBtnPrev.addEventListener('click', () => {
      currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
      updateImage(currentIndex);
    });

    heroBtnNext.addEventListener('click', () => {
      currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      updateImage(currentIndex);
    });
  }
});

// Places Slider logic
document.addEventListener('DOMContentLoaded', () => {
  const sliderWrapper = document.querySelector('.places__slider-wrapper');
  const btnPrev = document.querySelector('.places__btn-prev');
  const btnNext = document.querySelector('.places__btn-next');

  if (sliderWrapper && btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      const firstCard = sliderWrapper.querySelector('.places-card');
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 64; // Card width + gap (approx 4rem)
        sliderWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    });

    btnNext.addEventListener('click', () => {
      const firstCard = sliderWrapper.querySelector('.places-card');
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 64; // Card width + gap
        sliderWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });
  }
});
