const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const checkChannel = require('../utils/checkChannel');
const formatFooter = require('../utils/formatFooter');
const toTitleCase = require('../utils/toTitleCase');

function getColorFromImpact(impact) {
  switch (impact?.toLowerCase()) {
    case 'critical': return 0xff0000;
    case 'major': return 0xffa500;
    case 'minor': return 0xffff00;
    default: return 0x00ff00;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check Fortnite and Epic Games system status'),

  async execute(interaction) {
    if (!(await checkChannel(interaction))) return;

    await interaction.deferReply({ ephemeral: true });

    try {
      const [summaryRes, statusRes] = await Promise.all([
        fetch('https://status.epicgames.com/api/v2/summary.json'),
        fetch('https://status.epicgames.com/api/v2/status.json')
      ]);

      const summaryData = await summaryRes.json();
      const statusData = await statusRes.json();

      const description = toTitleCase(statusData.status.description);
      const impact = statusData.status.indicator;

      const components = summaryData.components || [];

      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Servers Status**')
        .setDescription(`Current Status: ${description}`)
        .setColor(getColorFromImpact(impact))
        .setFooter({ text: formatFooter() });

      if (components.length > 0) {
        embed.addFields(
          components.slice(0, 25).map(comp => ({
            name: comp.name.slice(0, 256),
            value: toTitleCase(comp.status || 'Unknown'),
            inline: true
          }))
        );
      } else {
        embed.addFields({ name: 'Components', value: 'No component data available.' });
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('[Status Command] Error:', err);
      try {
        await interaction.editReply({ content: '❌ Failed to fetch status data.' });
      } catch {
        // Ignore if interaction already acknowledged
      }
    }
  }
};
