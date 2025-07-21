const { EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const formatFooter = require('./utils/formatFooter');
const toTitleCase = require('./utils/toTitleCase');
const getChannelId = require('./utils/getChannelId');

let lastStatus = null;

module.exports = function startStatusMonitor(client) {
  setInterval(async () => {
    try {
      const res = await fetch('https://status.epicgames.com/api/v2/summary.json');
      const data = await res.json();

      const currentStatus = data.status.description;

      if (currentStatus === lastStatus || currentStatus.toLowerCase() === 'all systems operational') {
        return; // No change or everything is fine
      }

      lastStatus = currentStatus;

      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Servers Status**')
        .setDescription(`Current Status: ${toTitleCase(currentStatus)}`)
        .setColor(
          currentStatus.toLowerCase().includes('major outage')
            ? 0xff0000
            : 0xffff00
        )
        .addFields(
          data.components.slice(0, 25).map(comp => ({
            name: comp.name,
            value: toTitleCase(comp.status),
            inline: true
          }))
        )
        .setFooter({ text: formatFooter() });

      for (const [guildId] of client.guilds.cache) {
        const channelId = await getChannelId(guildId);
        const channel = client.channels.cache.get(channelId);
        if (channel) {
          await channel.send({ embeds: [embed] });
        }
      }
    } catch (err) {
      console.error('Status monitor error:', err);
    }
  }, 60_000);
};
