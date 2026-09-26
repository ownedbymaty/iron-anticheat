// Iron Anticheat — sdílená autentizace
const IronAuth = (() => {
  const API = (localStorage.getItem('iron_api') || '').replace(/\/$/, '');
  const SESSION_KEY = 'iron_session';
  const USER_KEY = 'iron_user';

  function token() { return localStorage.getItem(SESSION_KEY) || ''; }
  function user()  { return localStorage.getItem(USER_KEY) || ''; }
  function api()   { return API; }

  function headers() {
    return { 'Content-Type': 'application/json', 'x-iron-session': token() };
  }

  async function login(username, password) {
    const r = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!r.ok) return { ok: false };
    const data = await r.json();
    localStorage.setItem(SESSION_KEY, data.token);
    localStorage.setItem(USER_KEY, data.user);
    return { ok: true };
  }

  async function logout() {
    try { await fetch(API + '/auth/logout', { method: 'POST', headers: headers() }); } catch (_) {}
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
    location.href = 'login.html';
  }

  async function requireLogin() {
    if (!API) { location.href = 'login.html'; return false; }
    if (!token()) { location.href = 'login.html'; return false; }
    try {
      const r = await fetch(API + '/auth/me', { headers: headers() });
      if (!r.ok) { localStorage.removeItem(SESSION_KEY); location.href = 'login.html'; return false; }
      return true;
    } catch (_) {
      location.href = 'login.html';
      return false;
    }
  }

  return { login, logout, requireLogin, headers, token, user, api };
})();
