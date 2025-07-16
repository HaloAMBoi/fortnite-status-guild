const getChannelId = require('../utils/getChannelId');

module.exports = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  const allowed = await getChannelId(interaction.guildId);

  const allowedArray = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedArray.includes(interaction.channelId)) {
    return interaction.reply({
      content: '❌ You can only use commands in the configured channel.',
      flags: 64 // ephemeral
    });
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`❌ Error in command /${interaction.commandName}:`, err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '❌ Something went wrong while executing this command.',
        flags: 64
      });
    }
  }
};
