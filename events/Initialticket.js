/* eslint-disable no-shadow */
// eslint-disable-next-line no-unused-vars
const { SelectMenuInteraction, EmbedBuilder, PermissionsBitField, ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ChannelType, OverwriteType, Message } = require('discord.js');
const { parentID, everyoneRole } = require('../config.json');
let ticketType = null;

module.exports = {
	name: 'interactionCreate',
	/**
   *
   * @param {SelectMenuInteraction} interaction
   */
	async execute(interaction) {
		if (!interaction.isSelectMenu()) return;
		if (interaction.customId === 'select') {
			if (interaction.values == 'first_option') {
				ticketType = 'Bugreport';
			}
			else if (interaction.values == 'second_option') {
				ticketType = 'Spielermeldung';
			}
			else if (interaction.values == 'third_option') {
				ticketType = 'Teambewerbung';
			}
			else if (interaction.values == 'fourth_option') {
				ticketType = 'Donation';
			}

			const { guild, member } = interaction;
			const TicketID = Math.floor(Math.random() * 90000) + 10000;
			interaction.reply({
				content: `${member} ${TicketID} ${ticketType} ${guild} `,
				ephemeral: true,
			});

			const supportEmbed = new EmbedBuilder()
				.setTitle(`${member.displayName} | Typ: ${ticketType} | Ticket: ${TicketID}`)
				.setDescription(
					'Wir bitten dich etwas geduld zu haben, bis dir eine person aus dem Team hilft, bis dahin kannst du schonmal das problem erläutern.',
				)
				.setImage('https://cdn.discordapp.com/attachments/759729797135466497/1028313479989428425/tickets.jpg')
				.setTimestamp()
				.setFooter({ text: 'Made by Studio 5 with ❤️', iconURL: 'https://cdn.discordapp.com/attachments/759729797135466497/1028309898020257882/logo-merged.png' });

			const Buttons = new ActionRowBuilder();
			Buttons.addComponents(
				new ButtonBuilder()
					.setCustomId('close')
					.setLabel('Ticket schließen')
					.setStyle('1')
					.setEmoji('🚨'),
				new ButtonBuilder()
					.setCustomId('lock')
					.setLabel('Ticket Abschließen')
					.setStyle('2')
					.setEmoji('🔒'),
			);

			const createdChannel = await guild.channels.create({
				name: `${ticketType + '-' + TicketID}`,
				type: ChannelType.GuildText,
				parent: parentID,
				permissionOverwrites: [
					{
						type: OverwriteType.Member,
						id: member.id,
						allow: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						type: OverwriteType.Role,
						id: everyoneRole,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
				],
			});
			// eslint-disable-next-line no-unused-vars
			const { id } = createdChannel;
			createdChannel.send({
				embeds: [supportEmbed],
				components: [Buttons],
				content: `Hallo ${member}! Hier ist dein ticket, Informationen findest du unten im Embed`,
			});
			createdChannel.setTopic(`${member.displayName} | Typ: ${ticketType} | Ticket: ${TicketID}`);
		}
	},
};
