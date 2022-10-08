/* eslint-disable no-unused-vars */
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, CommandInteraction, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const { ticketöffnenID, embedColor, permRole } = require('../config.json');


/**
 *
 * @param {CommandInteraction} interaction
 */
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Moderator use only'),

	async execute(interaction) {
		const { guild } = interaction;
		if (!interaction.member.roles.cache.has(permRole)) {
			return await interaction.reply({
				content: 'Du hast leider nicht die nötige Rolle um dies zu tun!',
				ephemeral: true,
			});
		}
		const channel = interaction.guild.channels.cache.get(ticketöffnenID);
		const Embed = new EmbedBuilder()
			.setTitle(`${guild.name} | Ticket System`)
			.setDescription('Hier kannst du Support bekommen, wenn niemand vom Team im Voice Aktiv ist.')
			.setColor(embedColor)
			.setURL('https://restart-rp.de/')
			.addFields(
				{ name: 'Bugreport', value: 'Für Spielfehler aller art.', inline: false },
				{ name: 'Spieler Melden', value: 'Ein Spieler bricht die Regeln?', inline: false },
				{ name: 'Teambewerbung', value: 'Werde teil des Teams!', inline: false },
				{ name: 'Donations', value: 'Wenn das System dir sagt du sollst dich melden.', inline: false },
			)
			.setImage('https://cdn.discordapp.com/attachments/759729797135466497/1028313479989428425/tickets.jpg')
			.setTimestamp()
			.setFooter({ text: 'Made by Studio 5 with ❤️', iconURL: 'https://cdn.discordapp.com/attachments/759729797135466497/1028309898020257882/logo-merged.png' });

		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nichts ausgewählt')
					.addOptions(
						{
							label: 'Bugreport',
							description: 'Auto im Gulag Gelandet?',
							value: 'first_option',
						},
						{
							label: 'Spieler Melden',
							description: 'Wenn der Voice Support nicht da ist',
							value: 'second_option',
						},
						{
							label: 'Teambewerbung',
							description: 'Werde ein Teil des Teams',
							value: 'third_option',
						},
						{
							label: 'Donations',
							description: 'Wenn das System dir sagt du sollst dich melden',
							value: 'fourth_option',
						},
					),
			);
		channel.send({ embeds: [Embed], components: [row] });

		interaction.reply({
			content: 'Embed und menu wurden Gepostet',
			ephemeral: true,
		});
	},
};
