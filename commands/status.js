const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const formatFooter = require('../utils/formatFooter');
const toTitleCase = require('../utils/toTitleCase');

function getColor(impact) {
  switch (impact?.toLowerCase()) {
    case 'critical': return 0xff0000; // 🔴 red
    case 'major': return 0xffa500;    // 🟠 orange
    case 'minor': return 0xffff00;    // 🟡 yellow
    default: return 0x00ff00;         // ✅ green
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check Fortnite and Epic Games system status'),
  async execute(interaction) {
    try {
      const [summaryRes, incidentsRes] = await Promise.all([
        fetch('https://status.epicgames.com/api/v2/summary.json'),
        fetch('https://status.epicgames.com/api/v2/incidents/unresolved.json'),
      ]);

      const summary = await summaryRes.json();
      const incidentsData = await incidentsRes.json();
      const components = summary.components.filter(c => c.status !== 'operational');
      const incidents = incidentsData.incidents;

      let embedColor = 0x00ff00; // green by default

      if (incidents.length) {
        // pick highest impact level from all incidents
        const levels = incidents.map(i => i.impact);
        if (levels.includes('critical')) embedColor = getColor('critical');
        else if (levels.includes('major')) embedColor = getColor('major');
        else if (levels.includes('minor')) embedColor = getColor('minor');
      } else if (components.length) {
        // fallback if no incidents but degraded systems exist
        embedColor = 0xffff00;
      }

      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Servers Status**')
        .setColor(embedColor)
        .setFooter({ text: formatFooter() });

      if (incidents.length > 0) {
        embed.setDescription(`⚠️ ${incidents.length} active incident${incidents.length > 1 ? 's' : ''} detected.`);
        incidents.forEach(incident => {
          embed.addFields({
            name: `🛠️ ${incident.name}`,
            value: toTitleCase(incident.impact) + ' • ' + (incident.incident_updates[0]?.body || 'No description'),
            inline: false
          });
        });
      } else if (components.length > 0) {
        embed.setDescription(`Issues detected in ${components.length} system${components.length > 1 ? 's' : ''}.`);
        embed.addFields(
          components.slice(0, 25).map(comp => ({
            name: comp.name,
            value: toTitleCase(comp.status),
            inline: true
          }))
        );
      } else {
        embed.setDescription('✅ All systems are operational.');
      }

      await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to fetch Fortnite status.', flags: 64 });
    }
  }
};
