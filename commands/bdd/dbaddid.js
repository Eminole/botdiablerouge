const { ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const dblist = require('./dblistid');
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
    name: 'addid',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Ajoute une identité à la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'prenom',
            description: 'Enregistre le Prenom',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'nom',
            description: 'Enregistre le Nom.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'age',
            description: 'Enregistre l\'age.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'sang',
            description: 'Enregistre le groupe sanguin.',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    runInteraction(client, interaction) {
        const addprenom = interaction.options.getString('prenom');
        const addnom = interaction.options.getString('nom');
        const addage = interaction.options.getString('age');
        if (!addage) { const addage = "null"};
        const addsang = interaction.options.getString('sang');
        if (!addsang) { const addsang = "null"};

        db.query(`SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')`, function (err, result) {
            if (err) throw err;
            //JSON.stringify(result[0]).substr(-2, 1);
            if (JSON.stringify(result[0]).substr(-2, 1) === "1") {
                interaction.reply({ content: `${addprenom.toLowerCase()} ${addnom.toLowerCase()} existe déjà`, ephemeral: true});
            } else {
                db.query(`INSERT INTO Identite(prenom, nom, age, sang) VALUES ("${addprenom.toLowerCase()}", "${addnom.toLowerCase()}", "${addage}", "${addsang}") `);
                interaction.reply({ content: `${addprenom.toLowerCase()} ${addnom.toLowerCase()} ajouté à la base de donnée.`, ephemeral: true});
            }
        });
    }
};