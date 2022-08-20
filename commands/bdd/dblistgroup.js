const { PermissionsBitField, EmbedBuilder} = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const mysql = require('mysql');
const db = new mysql.createConnection({
    host: process.env.DB_HOST_TOKEN,
    password: process.env.DB_PWD_TOKEN,
    user: process.env.DB_USER_TOKEN,
    database: process.env.DB_NAME_TOKEN,
    port: process.env.DB_PORT_TOKEN,
    multipleStatements: true
});


module.exports = {
    name: 'listgroup',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'affiche la liste des groupes',
    //run(client, message, args) {},
    async runInteraction(client, interaction) {
        let text = `Liste des Groupes : \n`;
        db.query(`SELECT idgroupe, name FROM Groupe`, async (err, req) => {
            if (err) throw err;
            for ( ;req.length !== 0; ) {
                const firstelement = req.shift();
                text = `${text}- ID : \`${firstelement.idgroupe}\`   =>Groupe : ${firstelement.name.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
            };
            interaction.reply({ content: `${text}`, ephemeral: true });
        });        
    }
};