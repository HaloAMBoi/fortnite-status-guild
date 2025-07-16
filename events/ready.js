const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const commands = [];
  const commandFiles = fs
    .readdirSync(path.join(__dirname, '../commands'))
    .filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered globally.');
  } catch (err) {
    console.error('❌ Failed to register slash commands:', err);
  }
};
