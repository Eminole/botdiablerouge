const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { readdirSync } = require('fs');
const cmdfolder = readdirSync('./commands');

module.exports = {
    name: 'help',
    category: 'utils',
    permissions: [PermissionsBitField.Flags.SendMessages],
    description: 'Commande d\'aide',
    //async run(client, message, args) {},
    options: [
        {
            name: 'command',
            description: 'Taper le nom de votre commande',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    async runInteraction(client, interaction) {
        const cmdname = interaction.options.getString('command');

        if (!cmdname) {
            const noargsembed = new EmbedBuilder()
                .setColor('#f54ea7')
                .addFields([{ name: 'Liste des Commandes', value: `Une liste de toutes les catégories disponibles et leurs commandes.\nPour plus d'informations sur une commande, tapez \`/help <commande>\``}]);
            
            for (const category of cmdfolder) {
                noargsembed.addFields([{
                    name: `- ${category.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}:`,
                    value: `\`${client.commands.filter(cmd => cmd.category == category.toLowerCase()).map(cmd => cmd.name).join(', ')}\``
                }]);
            }

            return interaction.reply({ embeds : [noargsembed], ephemeral: true });
        }
 
        const cmd = client.commands.get(cmdname);
        if (!cmd) return interaction.reply({ content: 'La commande n\'existe pas!', ephemeral: true });

        const argsembed = new EmbedBuilder()
            .setColor('#f54ea7')
            .setTitle(`\`${cmd.name}\``)
            .setDescription(cmd.description)
            .setFooter({ text: `Permission(s) manquante(s): ${interaction.member.permissions.missing([cmd.permissions])}` });

        return interaction.reply({ embeds : [argsembed], ephemeral: true });
    }
};