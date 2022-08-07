const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');

const welcomebuttons = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
            .setCustomId('button-ami')
            .setLabel('Obtenir le role ami(e)')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('button-interim')
            .setLabel('Obtenir le role intérimaire')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId('button-recrue')
            .setLabel('Obtenir le role recrue')
            .setStyle(ButtonStyle.Danger)
    );


module.exports = {
    name: 'buttonacc',
    category: 'utils',
    permissions: [PermissionsBitField.Flags.Administrator],
    description: 'boutton pour l\'acceuil',
    /*async run(client, message, args) {
        const welcomeembed = new EmbedBuilder()
            .setTitle('Bienvenue')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription('Text a modifier description.')
        await message.channel.send({ embeds: [welcomeembed], components: [welcomebuttons] });
    },*/
    async runInteraction(client, interaction) {
        const welcomeembed = new EmbedBuilder()
            .setTitle('Bienvenue sur le Discord des Diables Rouges')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription('Bonjour,\nOn vous souhaite la bienvenue chez nous vous pouvez choisir le role qui correspond à la raison de votre venue sur le discord, parmis les trois choix ci dessous.')
        await interaction.reply({ embeds: [welcomeembed], components: [welcomebuttons] });
    },
};