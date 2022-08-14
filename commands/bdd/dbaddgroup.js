const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const dblist = require('./dblistid');
const mysql = require('mysql');
const db = new mysql.createConnection({
    host: process.env.DB_HOST_TOKEN,
    password: process.env.DB_PWD_TOKEN,
    user: process.env.DB_USER_TOKEN,
    database: process.env.DB_NAME_TOKEN,
    port: process.env.DB_PORT_TOKEN
});

module.exports = {
    name: 'addgroup',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Ajoute un groupe à la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'groupe',
            description: 'Enregistre le groupe',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    runInteraction(client, interaction) {
        const addgroup = interaction.options.getString('groupe');

        db.query(`SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgroup.toLowerCase()}')`, function (err, result) {
            if (err) throw err;
            //JSON.stringify(result[0]).substr(-2, 1);
            if (JSON.stringify(result[0]).substr(-2, 1) === "1") {
                interaction.reply({ content: `Groupe : ${addgroup.toLowerCase()} existe déjà`, ephemeral: true});
           } else {
                db.query(`INSERT INTO Groupe(name) VALUES ("${addgroup.toLowerCase()}") `);
                interaction.reply({ content: `Groupe : ${addgroup.toLowerCase()} ajouté à la base de donnée.`, ephemeral: true});
            }
        });
    }
};