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
    name: 'updatevehicule',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Met à jour le vehicule dans la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'plaque',
            description: 'Entrer la plaque à modifier',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'type',
            description: 'Enregistre le type à modifier',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'couleur',
            description: 'Enregistre la couleur à modifier.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    runInteraction(client, interaction) {
        const updateplaque = interaction.options.getString('plaque');
        const updatetype = interaction.options.getString('type');
        const updatecouleur = interaction.options.getString('couleur');
        const embedupdatevehicule = new EmbedBuilder()
        .setColor('#B50B00')
        .addFields([{ name: 'Update Vehicule', value: `Mise à jour des informations effectué :`}]);

        db.query(`SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${updateplaque}')`, function (err, result) {
            if (err) throw err; 
            //JSON.stringify(result[0]).substr(-2, 1);
            if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                interaction.reply({ content: `La plaque : \`${updateplaque}\` n\'existe pas`, ephemeral: true});
           } else {            
                db.query(`SELECT * FROM Vehicule WHERE plaque='${updateplaque}'`, function (error, resulta) {
                    if (error) throw error;
                    if (updatetype) {
                        db.query(`UPDATE Vehicule SET type = '${updatetype.toLowerCase()}' WHERE plaque='${updateplaque}'`)
                                embedupdatevehicule.addFields({
                                name: 'type :', value: `${resulta[0].type} à été changé en ==> ${updatetype}`
                            });
                    };
                    if (updatecouleur) {
                        db.query(`UPDATE Vehicule SET couleur = '${updatecouleur.toLowerCase()}' WHERE plaque='${updateplaque}'`)
                                embedupdatevehicule.addFields({
                                name: 'couleur :', value: `${resulta[0].couleur.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} à été changé en ==> ${updatecouleur.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`
                            });
                    };
                    interaction.reply({ embeds: [embedupdatevehicule], ephemeral: true});
                });
            }
        });
    }
};