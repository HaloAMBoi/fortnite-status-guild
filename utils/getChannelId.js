const config = require('../config');

module.exports = async function getChannelId(guildId) {
  if (process.env.USE_CONFIG === 'true') {
    try {
      const id = await config.getChannel(guildId);
      return id || process.env.FALLBACK_CHANNEL_ID;
    } catch {
      return process.env.FALLBACK_CHANNEL_ID;
    }
  } else {
    return process.env.FALLBACK_CHANNEL_ID;
  }
};
