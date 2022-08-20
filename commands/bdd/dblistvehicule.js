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
    name: 'listvehicule',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'affiche la liste des vehicules',
    //run(client, message, args) {},
    async runInteraction(client, interaction) {
        let text = `Liste des Véhicules : \n`;
        db.query(`SELECT plaque, type, couleur FROM Vehicule`, async (err, req) => {
            if (err) throw err;
            for ( ;req.length !== 0; ) {
                if (req[0].type === 'null' && req[0].couleur === 'null') {
                    const firstelement = req.shift();
                    text = `${text}- Plaque : \`${firstelement.plaque.toUpperCase()}\`   =>Type : Non enregistré   =>Couleur : Non enregistré\n`;
                } else if (req[0].type === 'null' && req[0].couleur !== 'null') {
                    const firstelement = req.shift();
                    text = `${text}- Plaque : \`${firstelement.plaque.toUpperCase()}\`   =>Type : Non enregistré   =>Couleur : ${firstelement.couleur.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
                } else if (req[0].type !== 'null' && req[0].couleur === 'null') {
                    const firstelement = req.shift();
                    text = `${text}- Plaque : \`${firstelement.plaque.toUpperCase()}\`   =>Type : ${firstelement.type}   =>Couleur : Non enregistré\n`;
                } else {
                    const firstelement = req.shift();
                    text = `${text}- Plaque : \`${firstelement.plaque.toUpperCase()}\`   =>Type : ${firstelement.type}   =>Couleur : ${firstelement.couleur.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
                }
            };
            interaction.reply({ content: `${text}`, ephemeral: true });
        });        
    }
};