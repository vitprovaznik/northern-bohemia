const nav = document.querySelector('nav');
const menuBtn = document.querySelector('.menu-btn-mobile');

if (nav) {
  // Sticky nav scroll behavior
  const handleScroll = () => {
    if (window.scrollY > 120) {
      nav.classList.add('nav--sticky');
    } else {
      nav.classList.remove('nav--sticky');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle behavior
  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.toggle('nav--menu-open');
      menuBtn.classList.toggle('is-active');
    });
  }

  // Close menu when clicking outside the nav element
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav--menu-open') && !nav.contains(e.target)) {
      nav.classList.remove('nav--menu-open');
      if (menuBtn) menuBtn.classList.remove('is-active');
    }
  });
}
