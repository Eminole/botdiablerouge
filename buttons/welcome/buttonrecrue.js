module.exports = {
    name: "button-recrue",
    async runInteraction(client, interaction) {
        try{
            await interaction.member.send('Tu a obtenue le role recrue');
        } catch(e){
            console.log(`${interaction.user.username} a obtenue le role recrue`);
        }
        await interaction.member.roles.add('986290465005506561');//Role a mettre
        await interaction.member.roles.remove('1005856960278708335');//Enleve le role d'arrivé
    },
};