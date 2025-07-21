const fetch = require('undici').fetch;

setInterval(() => {
  fetch('https://fortnite-status-guild.onrender.com').catch(err =>
    console.error('Self-ping failed:', err)
  );
}, 30_000);