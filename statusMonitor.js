const { EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const formatFooter = require('./utils/formatFooter');
const toTitleCase = require('./utils/toTitleCase');
const getChannelId = require('./utils/getChannelId');

let postedIncidents = new Set();

module.exports = function startStatusMonitor(client) {
  setInterval(async () => {
    try {
      const res = await fetch('https://status.epicgames.com/api/v2/incidents/unresolved.json');
      const data = await res.json();

      for (const incident of data.incidents) {
        if (postedIncidents.has(incident.id)) continue;

        postedIncidents.add(incident.id);

        const embed = new EmbedBuilder()
          .setTitle('Fortnite Servers Status – Issue')
          .setDescription(incident.incident_updates[0]?.body || 'No description.')
          .addFields(
            { name: 'Issue In', value: incident.name, inline: false },
            {
              name: 'Impact Type',
              value: toTitleCase(incident.impact || 'unknown'),
              inline: false
            }
          )
          .setColor(
            incident.impact === 'major' ? 0xff0000 :
            incident.impact === 'minor' ? 0xffff00 :
            0xffff00
          )
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
