const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upcoming-maintenance')
    .setDescription('View upcoming Fortnite maintenance schedule'),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const res = await fetch('https://status.epicgames.com/api/v2/scheduled-maintenances/upcoming.json');
      const data = await res.json();

      const now = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Qatar' });

      if (!data.scheduled_maintenances || data.scheduled_maintenances.length === 0) {
        return await interaction.editReply({ content: '✅ No upcoming maintenance is scheduled.' });
      }

      const m = data.scheduled_maintenances[0];

      const embed = new EmbedBuilder()
        .setTitle('🛠️ Fortnite - Scheduled Maintenance')
        .setDescription(`**Status:** Scheduled\n**Reason:** ${m.name || 'N/A'}`)
        .setColor(0xffff00)
        .addFields({
          name: 'Scheduled Time (GMT+3)',
          value: `🕒 **From:** ${new Date(m.scheduled_for).toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })}\n🕒 **To:** ${new Date(m.scheduled_until).toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })}`,
        })
        .setFooter({ text: `Checked: ${now}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[ERROR] command /upcoming-maintenance', err);
      if (!interaction.replied) {
        await interaction.editReply({ content: '❌ Failed to fetch maintenance data.' });
      }
    }
  },
};
