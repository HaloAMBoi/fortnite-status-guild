require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const pingServer = require('./ping');
const { startSelfPing } = require('./selfPing');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Register commands
const commandsPath = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Register events
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
}

// Start express + ping
pingServer.listen(process.env.PORT || 3000, () => {
  console.log(`[🌐] Ping server running on port ${process.env.PORT || 3000}`);
  startSelfPing();
});

// Log in
client.login(process.env.TOKEN)
  .then(() => console.log(`[✅] Logged in as ${client.user.tag}`))
  .catch(console.error);
