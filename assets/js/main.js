const originalNav = document.querySelector("nav");

if (originalNav) {
  // 1. Vytvoření klonu navigace pro sticky chování
  const clonedNav = originalNav.cloneNode(true);
  clonedNav.classList.add("nav--clone");
  document.body.appendChild(clonedNav);

  // 2. Sticky nav behavior (aplikováno pouze na klon)
  const handleScroll = () => {
    if (window.scrollY > 120) {
      clonedNav.classList.add("nav--sticky");

      // Zavřít původní menu při scrollování dolů
      originalNav.classList.remove("nav--menu-open");
      const originalBtn = originalNav.querySelector(".menu-btn-mobile");
      if (originalBtn) originalBtn.classList.remove("is-active");
    } else {
      clonedNav.classList.remove("nav--sticky");
      clonedNav.classList.remove("nav--menu-open"); // zavřít menu, pokud se vrátíme nahoru

      const btn = clonedNav.querySelector(".menu-btn-mobile");
      if (btn) btn.classList.remove("is-active");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 3. Mobilní menu logika (musí fungovat na obou navigacích)
  const setupMobileMenu = (navElement) => {
    const btn = navElement.querySelector(".menu-btn-mobile");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        navElement.classList.toggle("nav--menu-open");
        btn.classList.toggle("is-active");
      });
    }
  };

  setupMobileMenu(originalNav);
  setupMobileMenu(clonedNav);

  // Závření menu při kliknutí mimo
  document.addEventListener("click", (e) => {
    [originalNav, clonedNav].forEach((navElement) => {
      const btn = navElement.querySelector(".menu-btn-mobile");
      if (
        navElement.classList.contains("nav--menu-open") &&
        !navElement.contains(e.target)
      ) {
        navElement.classList.remove("nav--menu-open");
        if (btn) btn.classList.remove("is-active");
      }
    });
  });
}

// Experiences Slider logic
document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".experiences__slider-wrapper");
  const btnPrev = document.querySelector(".experiences__btn-prev");
  const btnNext = document.querySelector(".experiences__btn-next");

  if (sliderWrapper && btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
      // Find the first card to get its current dynamic width
      const firstCard = sliderWrapper.querySelector(".experience-card");
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24; // Card width + gap
        sliderWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });

    btnNext.addEventListener("click", () => {
      const firstCard = sliderWrapper.querySelector(".experience-card");
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 24; // Card width + gap
        sliderWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });
  }
});

// Hero Fade Slider Logic
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".hero-slide");
  const btnPrevs = document.querySelectorAll(".hero-btn-prev");
  const btnNexts = document.querySelectorAll(".hero-btn-next");

  if (slides.length > 0 && btnPrevs.length > 0 && btnNexts.length > 0) {
    let currentIndex = 0;
    const total = slides.length;

    const updateSlider = (index) => {
      const currentActive = document.querySelector(".hero-slide.active");

      slides.forEach((el, i) => {
        if (i === index) {
          el.classList.add("active");
          el.classList.remove("prev");
        } else {
          el.classList.remove("active");
        }
      });

      if (currentActive && currentActive !== slides[index]) {
        currentActive.classList.add("prev");
        setTimeout(() => {
          currentActive.classList.remove("prev");
        }, 800); // odpovídá délce transition v CSS
      }
    };

    btnPrevs.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
        updateSlider(currentIndex);
      });
    });

    btnNexts.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentIndex = currentIndex === total - 1 ? 0 : currentIndex + 1;
        updateSlider(currentIndex);
      });
    });
  }
});

// Places Slider logic
document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".places__slider-wrapper");
  const btnPrev = document.querySelector(".places__btn-prev");
  const btnNext = document.querySelector(".places__btn-next");

  if (sliderWrapper && btnPrev && btnNext) {
    btnPrev.addEventListener("click", () => {
      const firstCard = sliderWrapper.querySelector(".places-card");
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 64; // Card width + gap (approx 4rem)
        sliderWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });

    btnNext.addEventListener("click", () => {
      const firstCard = sliderWrapper.querySelector(".places-card");
      if (firstCard) {
        const scrollAmount = firstCard.offsetWidth + 64; // Card width + gap
        sliderWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });
  }
});
