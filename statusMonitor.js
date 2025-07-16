const { EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const formatFooter = require('./utils/formatFooter');
const toTitleCase = require('./utils/toTitleCase');
const getChannelId = require('./utils/getChannelId');

let postedIncidents = new Set();

const colors = {
  critical: 0xff0000,    // Red
  major: 0xffa500,       // Orange
  minor: 0xffff00,       // Yellow
  maintenance: 0x0000ff, // Blue (optional)
  none: 0x00ff00         // Green (optional)
};

module.exports = function startStatusMonitor(client) {
  setInterval(async () => {
    try {
      const res = await fetch('https://status.epicgames.com/api/v2/incidents/unresolved.json');
      const data = await res.json();

      for (const incident of data.incidents) {
        if (postedIncidents.has(incident.id)) continue;
        postedIncidents.add(incident.id);

        const impact = incident.impact || 'minor'; // fallback impact
        const impactColor = colors[impact] || 0xffff00; // default yellow

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Servers Status – Issue')
          .setDescription(incident.incident_updates[0]?.body || 'No description.')
          .addFields(
            { name: 'Issue In', value: incident.name, inline: false },
            { name: 'Impact Type', value: toTitleCase(impact), inline: false }
          )
          .setColor(impactColor)
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
  }, 60_000);
};
