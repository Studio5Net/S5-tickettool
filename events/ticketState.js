/* eslint-disable no-case-declarations */
// eslint-disable-next-line no-unused-vars
const { ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { everyoneRole } = require('../config.json');
const discordTranscripts = require('discord-html-transcripts');
const { transcriptID } = require('../config.json');

module.exports = {
	name: 'interactionCreate',
	/**
   *
   * @param {ButtonBuilder} interaction
   */

	async execute(interaction) {
		if (interaction.isButton()) {
			if (interaction.customId == 'close') {
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('realClose')
							.setLabel('Ticket Wirklich schließen')
							.setStyle('1')
							.setEmoji('🚨'),
					);
				interaction.reply({
					content: 'Sicher, dass das Ticket geschlossen werden soll?',
					ephemeral: true,
					components: [row],
				});
			}
			else if (interaction.customId == 'lock') {
				interaction.channel.permissionOverwrites.edit(everyoneRole, { SendMessages: false });
				interaction.reply({
					content: 'Das Ticket wurde erfolgreich gesperrt',
					ephemeral: true,
				});
				interaction.channel.permissionOverwrites.edit(everyoneRole, { SendMessages: false });
				console.log(interaction);
				const Buttons = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('close')
							.setLabel('Ticket schließen')
							.setStyle('1')
							.setEmoji('🚨'),
						new ButtonBuilder()
							.setCustomId('unlock')
							.setLabel('Ticket erneut öffnen')
							.setStyle('2')
							.setEmoji('🔒'),
					);
				const messageFetch = await interaction.fetchReply();
				const id = messageFetch.reference.messageId;
				const message = await interaction.channel.messages.fetch(id);
				message.edit({ components: [Buttons] });
			}
			else if (interaction.customId == 'unlock') {
				interaction.channel.permissionOverwrites.edit(everyoneRole, { SendMessages: true });
				interaction.reply({
					content: 'Das Ticket wurde erfolgreich entsperrt',
					ephemeral: true,
				});
				interaction.channel.permissionOverwrites.edit(everyoneRole, { SendMessages: true });
				const Buttons = new ActionRowBuilder()
					.addComponents(
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


				const messageFetch = await interaction.fetchReply();
				const id = messageFetch.reference.messageId;
				const message = await interaction.channel.messages.fetch(id);
				message.edit({ components: [Buttons] });
			}
			else if (interaction.customId == 'realClose') {
				const tschannel = interaction.channel;
				const transcripch = interaction.guild.channels.cache.get(transcriptID);
				const attachment = await discordTranscripts.createTranscript(tschannel);
				const TicketTitle = interaction.channel.topic;
				interaction.reply({
					content: 'Das Ticket wird in 5 Sekunden gelöscht',
					ephemeral: true,
				});

				transcripch.send({
					content: TicketTitle,
					files: [attachment],
					filename: 'transcript | Restart-rp.html',
					saveImages: true,
				});
				setTimeout(function() {
					tschannel.delete(5000);
				}, 5000);
			}
		}
	} };
