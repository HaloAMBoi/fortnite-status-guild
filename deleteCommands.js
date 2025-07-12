const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] } // empty array clears all global commands
    );
    console.log('✅ All global slash commands deleted.');
  } catch (error) {
    console.error('❌ Error deleting commands:', error);
  }
})();
