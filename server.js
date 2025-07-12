// server.js
require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Ha, this works!');
});

app.listen(PORT, () => {
  console.log(`[Web] Express server running on port ${PORT}`);
});
