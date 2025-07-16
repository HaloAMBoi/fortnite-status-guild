const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function startSelfPing() {
  const url = process.env.SELF_PING_URL;
  if (!url) {
    console.warn('[⚠️] SELF_PING_URL not set in .env');
    return;
  }

  setInterval(async () => {
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log(`[🔁] Self-ping OK: ${res.status} - ${text.slice(0, 50)}...`);
    } catch (err) {
      console.error('[❌] Self-ping failed:', err.message);
    }
  }, 30_000);
}

module.exports = { startSelfPing };
