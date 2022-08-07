const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'emit',
    category: 'admin',
    permissions: [PermissionsBitField.Flags.Administrator],
    description: 'Emettre un événement au choix.',
    /*run(client, message, args) {
        if(!args[0] ||  !args[0].match(/^(guildMemberAdd|guildMemberRemove)$/)) return message.reply(`Merci d'entrer un evenement valide ( \`guildMemberAdd\` / \`guildMemberRemove\` )`);
        if (args[0] == 'guildMemberAdd'){
            client.emit('guildMemberAdd', message.member);
            message.reply('Event guildMemberAdd émit!');
        }else{
            client.emit('guildMemberRemove', message.member);
            message.reply('Event guildMemberRemove émit!');
        }
    },*/
    options: [{
        name: 'event',
        description: 'Choisir un évènement à émettre.',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
            {
                name: 'guildMemberAdd',
                value: 'guildMemberAdd'
            },
            {
                name: 'guildMemberRemove',
                value: 'guildMemberRemove'
            }
        ]
    }],
    runInteraction(client, interaction) {
        const evtchoices = interaction.options.getString('event');

        if (evtchoices == 'guildMemberAdd'){
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply({ content: 'Event guildMemberAdd émit!', ephemeral: true});
        }else{
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply({ content: 'Event guildMemberRemove émit!', ephemeral: true});
        }
    }
};