require('dotenv').config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  alertChannelId: process.env.ALERT_CHANNEL_ID,
  port: process.env.PORT || 3000
};
