const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running ✅');
});

module.exports = app;
