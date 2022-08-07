const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'poll',
    category: 'utils',
    permissions: [PermissionsBitField.Flags.SendMessages],
    description: 'Poster votre propre sondage.',
    //async run(client, message, args) {},
    options: [
        {
            name: 'title',
            description: 'Taper le titre de votre sondage.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'content',
            description: 'Taper la question de votre sondage.',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    async runInteraction(client, interaction) {
        const polltitle = interaction.options.getString('title');
        const pollcontent = interaction.options.getString('content');

        const embed = new EmbedBuilder()
            .setTitle(polltitle)
            .setColor('#D69800')
            .setDescription(pollcontent)
            .setTimestamp()
            .setFooter({ text: `Nouveau sondage généré par: ${interaction.user.tag}!`})

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true});
        poll.react('<:Coche:1005864252621467720>');
        poll.react('❌');
    }
};