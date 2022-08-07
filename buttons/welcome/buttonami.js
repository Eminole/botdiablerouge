module.exports = {
    name: "button-ami",
    async runInteraction(client, interaction) {
        try{
            await interaction.member.send('Tu a obtenue le role ami(e)');
        } catch(e){
            console.log(`${interaction.user.username} a obtenue le role ami`);
        }
        await interaction.member.roles.add('984453371626934333');//Role a mettre
        await interaction.member.roles.remove('1005856960278708335');//Enleve le role d'arrivé
    },
};