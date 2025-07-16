const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all bot commands'),

  async execute(interaction) {
    await interaction.reply({
      ephemeral: true,
      embeds: [
        new EmbedBuilder()
          .setTitle('**Fortnite Status - Help**')
          .setColor(0x5865f2)
          .setDescription(
            `**/config** : Configure which channel receives alerts *(admin only)*\n` +
            `**/status** : Get current Fortnite server status\n` +
            `**/upcoming-maintenance** : View upcoming maintenance info`
          )
      ]
    });
  }
};
