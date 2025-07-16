const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ping server running on port ${PORT}`);
});

module.exports = app;
