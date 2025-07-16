const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upcoming-maintenance')
    .setDescription('View upcoming Fortnite maintenance schedule'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const res = await fetch('https://status.epicgames.com/api/v2/scheduled-maintenances/upcoming.json');
      const data = await res.json();
      const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Qatar' });

      if (data.scheduled_maintenances.length === 0) {
        return await interaction.editReply({ content: '✅ No upcoming maintenance is scheduled.' });
      }

      const m = data.scheduled_maintenances[0];
      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Servers Status - Scheduled Maintenance**')
        .setDescription(`Current Status: Scheduled\nReason: ${m.name || 'N/A'}`)
        .setColor(0xffff00)
        .addFields({
          name: 'Scheduled Time (GMT+3)',
          value: `${new Date(m.scheduled_for).toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })} - ${new Date(m.scheduled_until).toLocaleString('en-GB', { timeZone: 'Asia/Qatar' })}`
        })
        .setFooter({ text: time });

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[ERROR] command upcoming-maintenance', err);
      await interaction.editReply({ content: '❌ Failed to fetch maintenance data.' });
    }
  }
};
