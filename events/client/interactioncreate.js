module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);

            if(!cmd) return interaction.reply(`Cette commande n'existe pas!`);

            if (!interaction.member.permissions.has([cmd.permissions])) return interaction.reply({ content: `Vous n'avez pas la/les permission(s) requise(s) (\`${interaction.member.permissions.missing([cmd.permissions])}\`) pour utiliser cette commande!`, ephemeral: true, });

            cmd.runInteraction(client, interaction);
        } else if (interaction.isButton()) {
            const btn = client.buttons.get(interaction.customId);
            if(!btn) return interaction.reply(`Ce bouton n'existe pas!`);
            btn.runInteraction(client, interaction);
        }else if (interaction.isSelectMenu()) {
            const selectmenu = client.selectmenus.get(interaction.customId);
            if(!selectmenu) return interaction.reply(`Ce menu n'existe pas!`);
            selectmenu.runInteraction(client, interaction);
        }
    },
};