const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('undici').fetch;
const moment = require('moment-timezone');
const checkChannel = require('../utils/checkChannel');
const formatFooter = require('../utils/formatFooter');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upcoming-maintenance')
    .setDescription('Show upcoming Fortnite maintenance'),
  async execute(interaction) {
    if (!(await checkChannel(interaction))) return;

    try {
      const res = await fetch('https://status.epicgames.com/api/v2/scheduled-maintenances/upcoming.json');

      if (!res.ok) {
        console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
        await interaction.reply({
          content: '❌ Epic Games API is unavailable. Please try again later.',
          flags: 64
        });
        return;
      }

      const data = await res.json();
      const hasMaintenance = data.maintenances && data.maintenances.length > 0;

      const embed = new EmbedBuilder()
        .setTitle('**Fortnite Servers Status**')
        .setDescription(
          hasMaintenance
            ? 'Current Status: Scheduled Maintenance'
            : 'Current Status: All Systems Operational'
        )
        .setColor(hasMaintenance ? 0xffff00 : 0x00ff00)
        .setFooter({ text: formatFooter() });

      if (hasMaintenance) {
        data.maintenances.forEach(m => {
          embed.addFields({
            name: m.name || 'Unnamed Maintenance',
            value: moment(m.scheduled_for).tz('Asia/Qatar').format('MMMM Do YYYY, h:mm A')
          });
        });
      } else {
        embed.addFields({
          name: 'No upcoming maintenances',
          value: '🎉 All clear for now!'
        });
      }

      await interaction.reply({ embeds: [embed], flags: 64 });

    } catch (err) {
      console.error('Failed to fetch upcoming maintenance:', err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Failed to fetch maintenance data.',
          flags: 64
        });
      }
    }
  }
};
