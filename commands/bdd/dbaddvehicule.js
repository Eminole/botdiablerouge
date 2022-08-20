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
    name: 'addvehicule',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Ajoute un vehicule à la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'plaque',
            description: 'Enregistre la plaque du vehicule',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'type',
            description: 'Enregistre le type du vehicule',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'couleur',
            description: 'Enregistre la couleur du vehicule',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    runInteraction(client, interaction) {
        const addplaque = interaction.options.getString('plaque');
        const addtype = interaction.options.getString('type');
        if (!addtype) { const addtype = "null"};
        const addcouleur = interaction.options.getString('couleur');
        if (!addcouleur) { const addcouleur = "null"};

        db.query(`SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}')`, function (err, result) {
            if (err) throw err;
            //JSON.stringify(result[0]).substr(-2, 1);
            if (JSON.stringify(result[0]).substr(-2, 1) === "1") {
                interaction.reply({ content: `Vehicule avec la plaque : ${addplaque.toLowerCase()} existe déjà`, ephemeral: true});
           } else {
                db.query(`INSERT INTO Vehicule(plaque, type, couleur) VALUES ("${addplaque.toLowerCase()}", "${addtype}", "${addcouleur}") `);
                interaction.reply({ content: `Vehicule avec la plaque : ${addplaque.toLowerCase()} ajouté à la base de donnée.`, ephemeral: true});
            }
        });
    }
};