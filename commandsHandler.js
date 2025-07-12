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
      const result = await status.fetchFormattedStatus();
      if (!result) {
        return await interaction.reply({ content: '✅ All Fortnite systems are operational.', ephemeral: true });
      }

      await interaction.reply({ content: result, ephemeral: true });

      // Also post publicly if there are real issues
      const alertChannel = client.channels.cache.get(process.env.ALERT_CHANNEL_ID);
      if (alertChannel && alertChannel.isTextBased()) {
        alertChannel.send({ content: result }).catch(() => {});
      }
    }

    // /upcoming-maintenance
    if (commandName === 'upcoming-maintenance') {
      const message = await status.fetchUpcomingMaintenance();
      return await interaction.reply({ content: message, ephemeral: true });
    }
  }
};
