const { EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const formatFooter = require('./utils/formatFooter');
const toTitleCase = require('./utils/toTitleCase');
const getChannelId = require('./utils/getChannelId');

const sent = new Set();

function getColor(impact) {
  switch (impact?.toLowerCase()) {
    case 'critical': return 0xff0000; // 🔴 Red
    case 'major': return 0xffa500;    // 🟠 Orange
    case 'minor': return 0xffff00;    // 🟡 Yellow
    default: return 0x00ff00;         // ✅ Green
  }
}

module.exports = function startStatusMonitor(client) {
  setInterval(async () => {
    try {
      const res = await fetch('https://status.epicgames.com/api/v2/incidents/unresolved.json');
      const { incidents } = await res.json();

      for (const incident of incidents) {
        if (sent.has(incident.id)) continue;
        sent.add(incident.id);

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Servers Status – Issue')
          .setDescription(incident.incident_updates[0]?.body || 'No description provided.')
          .addFields(
            { name: '🛠️ Affected System', value: incident.name, inline: false },
            { name: '📊 Impact Level', value: toTitleCase(incident.impact || 'unknown'), inline: false }
          )
          .setColor(getColor(incident.impact))
          .setFooter({ text: formatFooter() });

        for (const [guildId] of client.guilds.cache) {
          const channelId = await getChannelId(guildId);
          const channel = client.channels.cache.get(channelId);
          if (channel) {
            await channel.send({ embeds: [embed] });
          }
        }
      }
    } catch (err) {
      console.error('[Monitor] Error while checking incidents:', err);
    }
  }, 60000); // Every 60 seconds
};
