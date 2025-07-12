const { EmbedBuilder } = require('discord.js');
const status = require('./status');

module.exports = {
  async handleInteraction(interaction, client) {
    const { commandName } = interaction;

    // /help
    if (commandName === 'help') {
      const helpEmbed = new EmbedBuilder()
        .setTitle('Fortnite Status Bot — Help')
        .setColor('Blue')
        .setDescription([
          '**/help** — Show this help menu.',
          '**/status** — Check Fortnite system status.',
          '**/upcoming-maintenance** — View upcoming scheduled maintenance.',
        ].join('\n'));

      return await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }

    // /status
    if (commandName === 'status') {
      await interaction.deferReply({ ephemeral: true }); // defer immediately

      const result = await status.fetchFormattedStatus();
      if (!result) {
        return await interaction.editReply({ content: '✅ All Fortnite systems are operational.' });
      }

      await interaction.editReply({ content: result });

      // Also post publicly if there's an issue
      const alertChannel = client.channels.cache.get(process.env.ALERT_CHANNEL_ID);
      if (alertChannel && alertChannel.isTextBased()) {
        alertChannel.send({ content: result }).catch(() => {});
      }

      return;
    }

    // /upcoming-maintenance
    if (commandName === 'upcoming-maintenance') {
      await interaction.deferReply({ ephemeral: true });

      const message = await status.fetchUpcomingMaintenance();
      return await interaction.editReply({ content: message });
    }
  }
};
