const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Base route for UptimeRobot to ping
app.get('/', (req, res) => {
  res.status(200).send('✅ Bot is running!');
});

// Keep-alive ping loop to prevent Render from sleeping
const keepAliveUrl = process.env.KEEPALIVE_URL;

if (keepAliveUrl) {
  setInterval(async () => {
    try {
      await axios.get(keepAliveUrl);
      console.log(`[KeepAlive] Pinged ${keepAliveUrl}`);
    } catch (err) {
      console.warn('[KeepAlive] Failed to ping:', err.message);
    }
  }, 30 * 1000); // every 30 seconds
} else {
  console.warn('[KeepAlive] No KEEPALIVE_URL set in .env');
}

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Express running on port ${PORT}`);
});
