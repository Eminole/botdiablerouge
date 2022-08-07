module.exports = {
    name: "button-interim",
    async runInteraction(client, interaction) {
        try{
            await interaction.member.send('Tu a obtenue le role intérimaire');
        } catch(e){
            console.log(`${interaction.user.username} a obtenue le role intérimaire`);
        }
        await interaction.member.roles.add('984454154015625258');//Role a mettre
        await interaction.member.roles.remove('1005856960278708335');//Enleve le role d'arrivé
    },
};