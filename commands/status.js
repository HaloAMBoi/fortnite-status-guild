const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const checkChannel = require('../utils/checkChannel');
const formatFooter = require('../utils/formatFooter');
const toTitleCase = require('../utils/toTitleCase');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check Fortnite and Epic Games system status'),
  async execute(interaction) {
    if (!(await checkChannel(interaction))) return;

    try {
      const res = await fetch('https://status.epicgames.com/api/v2/summary.json');
      const data = await res.json();
      const status = data.status.description;
      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Servers Status**')
        .setDescription(`Current Status: ${toTitleCase(status)}`)
        .setColor(status === 'All Systems Operational' ? 0x00ff00 : 0xffff00)
        .addFields(
          data.components.slice(0, 25).map(comp => ({
            name: comp.name,
            value: toTitleCase(comp.status),
            inline: true
          }))
        )
        .setFooter({ text: formatFooter() });

      await interaction.reply({ embeds: [embed], flags: 64 });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Failed to fetch status.', flags: 64 });
    }
  }
};
