module.exports = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`❌ Error in command /${interaction.commandName}:`, err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: '❌ There was an error executing that command.',
        flags: 64
      });
    }
  }
};
