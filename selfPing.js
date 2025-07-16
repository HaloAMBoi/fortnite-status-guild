const fetch = require('undici').fetch;

setInterval(() => {
  fetch('https://your-render-url.onrender.com').catch(err =>
    console.error('Self-ping failed:', err)
  );
}, 30_000);