require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const commandsHandler = require('./commandsHandler');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const slashCommands = [
  {
    name: 'help',
    description: 'Show help information',
  },
  {
    name: 'status',
    description: 'Check current Fortnite status',
  },
  {
    name: 'upcoming-maintenance',
    description: 'Check upcoming maintenance info',
  },
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log('[Slash] Registering global slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });
    console.log('[Slash] Commands registered.');
  } catch (err) {
    console.error('[Slash] Error registering commands:', err);
  }
}

client.once('ready', async () => {
  console.log(`[Discord] Logged in as ${client.user.tag}`);
  await registerCommands();
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await commandsHandler.handleInteraction(interaction, client);
  } catch (err) {
    console.error('[Command] Error handling interaction:', err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '⚠️ An error occurred.', ephemeral: true });
    }
  }
});

// Global error catchers
process.on('unhandledRejection', (reason) => {
  console.error('[UnhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UncaughtException]', err);
});

client.login(DISCORD_TOKEN);

// Launch express server
require('./server');
