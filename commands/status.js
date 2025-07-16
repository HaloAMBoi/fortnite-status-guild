const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;

const COLORS = {
  operational: 0x00ff00,         // green
  degraded_performance: 0xffff00, // yellow
  partial_outage: 0xffa500,      // orange
  major_outage: 0xff0000,        // red
  maintenance: 0x0000ff          // blue
};

// Map Epic's component status to our embed color keys
function mapStatusToColorKey(status) {
  switch (status) {
    case 'operational': return 'operational';
    case 'degraded_performance': return 'degraded_performance';
    case 'partial_outage': return 'partial_outage';
    case 'major_outage': return 'major_outage';
    case 'under_maintenance': return 'maintenance';
    default: return 'operational';
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Shows current Fortnite server status'),

  async execute(interaction) {
    try {
      // Fetch status from Epic's official status API
      const res = await fetch('https://status.epicgames.com/api/v2/status.json');
      const data = await res.json();

      // Top-level status description
      const overallStatus = data.status.description || 'Unknown';

      // Determine embed color based on overall status text
      let embedColor = COLORS.operational; // default green

      if (/partial outage/i.test(overallStatus)) embedColor = COLORS.partial_outage;
      else if (/major outage/i.test(overallStatus)) embedColor = COLORS.major_outage;
      else if (/degraded performance/i.test(overallStatus)) embedColor = COLORS.degraded_performance;
      else if (/maintenance/i.test(overallStatus)) embedColor = COLORS.maintenance;

      const embed = new EmbedBuilder()
        .setTitle('Fortnite Servers Status')
        .setDescription(`**Current Status:** ${overallStatus}`)
        .setColor(embedColor)
        .setFooter({ text: 'Data from Epic Games Status' });

      // Add each component with its current status
      for (const component of data.components) {
        const statusText = component.status.replace(/_/g, ' '); // prettify status
        embed.addFields({ name: component.name, value: statusText.charAt(0).toUpperCase() + statusText.slice(1), inline: true });
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('[Status Command] Error:', error);
      await interaction.reply('❌ Failed to fetch server status. Please try again later.');
    }
  }
};
