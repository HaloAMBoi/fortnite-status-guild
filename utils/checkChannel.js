const getChannelId = require('./getChannelId');

module.exports = async function checkChannel(interaction) {
  const correctId = await getChannelId(interaction.guildId);
  if (interaction.channelId !== correctId) {
    await interaction.reply({ content: '❌ You can only use commands in the configured channel.', flags: 64 });
    return false;
  }
  return true;
};
