const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

function getColor(status) {
  if (status.includes('Major')) return 0xff0000; // red
  if (status.includes('Degraded') || status.includes('Partial')) return 0xffff00; // yellow
  return 0x00ff00; // green
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Get current Fortnite server status'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const res = await fetch('https://status.epicgames.com/api/v2/status.json');
      const data = await res.json();
      const status = data.status.description;
      const time = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Qatar' });

      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Status**')
        .setDescription(`Status: ${status}`)
        .setColor(getColor(status))
        .setFooter({ text: time });

      if (status !== 'All Systems Operational') {
        embed.addFields({ name: 'Issues', value: data.status.indicator });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error('[ERROR] command status', err);
      await interaction.editReply({ content: '❌ Failed to fetch server status.' });
    }
  }
};
