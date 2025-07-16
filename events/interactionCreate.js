module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const allowedChannel = process.env.ALERT_CHANNEL_ID;

    // Only allow commands in configured channel
    if (['status', 'help', 'upcoming-maintenance'].includes(command.data.name)) {
      if (interaction.channel.id !== allowedChannel) {
        if (!interaction.replied && !interaction.deferred) {
          try {
            return await interaction.reply({
              content: '❌ You can only use commands in the configured channel.',
              flags: 64,
            });
          } catch (err) {
            console.warn('[⚠️] Failed to reply (possibly expired interaction):', err.message);
            return;
          }
        }
        return;
      }
    }

    // Execute command safely
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`[ERROR] command ${interaction.commandName}`, error);

      if (interaction.replied || interaction.deferred) {
        interaction.editReply({
          content: '❌ There was an error while executing this command.',
        });
      } else {
        interaction.reply({
          content: '❌ There was an error while executing this command.',
          ephemeral: true,
        }).catch(() => {});
      }
    }
  },
};
