const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = async function getChannelId(guildId) {
  if (process.env.USE_CONFIG === 'true') {
    try {
      const [rows] = await pool.query(
        'SELECT channel_id FROM fortnite_config WHERE guild_id = ?',
        [guildId]
      );
      if (rows.length > 0) return rows[0].channel_id;
    } catch (err) {
      console.error('MySQL error in getChannelId:', err);
    }
  }

  // Fallback to one or more hardcoded channel IDs
  const fallback = process.env.FALLBACK_CHANNEL_ID;
  if (fallback.includes(',')) {
    return fallback.split(',').map(id => id.trim());
  }
  return fallback.trim();
};
