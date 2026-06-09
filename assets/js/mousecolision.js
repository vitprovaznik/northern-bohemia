document.addEventListener("DOMContentLoaded", () => {
        const worldEl = document.getElementById("world");
        if (!worldEl) return;

        /* 
         * ŘÍZENÍ VRSTEV PRO GRAVITACI (Zcela odděleno od fyzikálního enginu)
         * - Reaguje na probublání kliknutí ze slova nahoru na world.
         */
        worldEl.addEventListener('mousedown', () => {
          worldEl.style.pointerEvents = 'auto';
          worldEl.style.zIndex = '9999';
        });
        worldEl.addEventListener('touchstart', () => {
          worldEl.style.pointerEvents = 'auto';
          worldEl.style.zIndex = '9999';
        }, { passive: true });
        
        window.addEventListener('mouseup', () => {
          worldEl.style.pointerEvents = 'none';
          worldEl.style.zIndex = '';
        });
        window.addEventListener('touchend', () => {
          worldEl.style.pointerEvents = 'none';
          worldEl.style.zIndex = '';
        });
      });