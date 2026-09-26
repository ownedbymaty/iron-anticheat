const IronAPI = (() => {
  async function feed(since) {
    const r = await fetch(IronAuth.api() + '/api/feed?since=' + since, { headers: IronAuth.headers() });
    if (!r.ok) return { events: [], cursor: since };
    return r.json();
  }
  async function players() {
    const r = await fetch(IronAuth.api() + '/api/players', { headers: IronAuth.headers() });
    if (!r.ok) return { players: [] };
    return r.json();
  }
  async function action(action, id, reason) {
    const r = await fetch(IronAuth.api() + '/api/action', {
      method: 'POST',
      headers: IronAuth.headers(),
      body: JSON.stringify({ action, id, reason }),
    });
    return r.ok;
  }
  return { feed, players, action };
})();

function fmtTime(ms) {
  return new Date(Number(ms)).toLocaleTimeString();
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
