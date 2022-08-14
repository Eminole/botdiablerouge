const { PermissionsBitField, EmbedBuilder} = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const mysql = require('mysql');
const db = new mysql.createConnection({
    host: process.env.DB_HOST_TOKEN,
    password: process.env.DB_PWD_TOKEN,
    user: process.env.DB_USER_TOKEN,
    database: process.env.DB_NAME_TOKEN,
    port: process.env.DB_PORT_TOKEN
});


module.exports = {
    name: 'listid',
    category: 'utils',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'affiche la liste des ids',
    //run(client, message, args) {},
    async runInteraction(client, interaction) {
        /*const listidembed = new EmbedBuilder()
        .setColor('#B50B00')
        .addFields([{ name: 'Liste des Identités', value: `Liste des Identités :`}]);

        db.query(`SELECT Id, prenom , nom FROM Identite`, async (err, req) => {
            if (err) throw err;
            for ( ;req.length !== 0; ) {
                const firstelement = req.shift();
                listidembed.addFields([{
                    name: `- ID : \`${firstelement.Id}\``,
                    value: `- Prénom : ${firstelement.prenom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} - Nom : ${firstelement.nom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`
                }]);
            };
            interaction.reply({ embeds : [listidembed], ephemeral: true });
        });*/
        let text = `Liste des Identités : \n`;
        db.query(`SELECT Id, prenom , nom FROM Identite`, async (err, req) => {
            if (err) throw err;
            for ( ;req.length !== 0; ) {
                const firstelement = req.shift();
                text = `${text}- ID : \`${firstelement.Id}\`   =>Prénom : ${firstelement.prenom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}   =>Nom : ${firstelement.nom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
            };
            interaction.reply({ content: `${text}`, ephemeral: true });
        });        
    }
};