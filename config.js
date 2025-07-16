const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

module.exports = {
  async getChannel(guildId) {
    const [rows] = await pool.execute('SELECT channel_id FROM fortnite_config WHERE guild_id = ?', [guildId]);
    return rows[0]?.channel_id || null;
  }
};
