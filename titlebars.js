// Iron Anticheat — simulace Electron titlebaru ve webu.
// V prohlížeči:
//   max  → fullscreen toggle
//   min  → nelze (prohlížeč nedovolí), jen se zešedne
//   close→ pokusí se window.close(), jinak přesměruje na login
// V Electronu (pokud to později zabalíš):
//   tlačítka volají window.ironWindow.minimize() / .maximize() / .close()

function initFrame(activeHref, pageTitle) {
  const sideUser = document.getElementById('side-user');
  if (sideUser) sideUser.textContent = IronAuth.user() || '—';

  const logout = document.getElementById('logout');
  if (logout) logout.onclick = (e) => { e.preventDefault(); IronAuth.logout(); };

  document.querySelectorAll('.side-nav a').forEach(a => {
    if (a.getAttribute('href') === activeHref) a.classList.add('active');
  });

  const h1 = document.querySelector('.content-head h1');
  if (h1 && pageTitle) h1.textContent = pageTitle;

  document.querySelectorAll('.titlebar .tb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      if (window.ironWindow) {
        if (action === 'min')   return window.ironWindow.minimize();
        if (action === 'max')   return window.ironWindow.maximize();
        if (action === 'close') return window.ironWindow.close();
      }

      if (action === 'max') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      } else if (action === 'min') {
        // prohlížeč neumí minimalizovat okno z JS — vizuální odezva
        btn.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 200 });
      } else if (action === 'close') {
        window.close();
        setTimeout(() => {
          if (!window.closed) location.href = 'login.html';
        }, 100);
      }
    });
  });
}
