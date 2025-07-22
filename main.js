require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('./ping'); // express ping server for Render
require('./selfPing'); // optional — runs on load

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

// Load slash commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load event handlers
client.on('interactionCreate', require('./events/interactionCreate'));

const startStatusMonitor = require('./statusMonitor');

client.once('ready', () => {
  require('./events/ready')(client); // now valid
  startStatusMonitor(client);
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('Failed to login:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception thrown:', err);
});
