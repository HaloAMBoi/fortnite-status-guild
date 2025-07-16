const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all bot commands'),
  async execute(interaction) {
    const helpText = `
**Available Commands:**
- \`/status\`: Check current Fortnite server and system status.
- \`/upcoming-maintenance\`: View next scheduled maintenance with time.
- \`/help\`: Show this help message.
`;
    await interaction.reply({ content: helpText, flags: 64 });
  }
};
