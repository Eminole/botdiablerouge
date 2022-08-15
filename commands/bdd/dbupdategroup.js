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
    name: 'updategroup',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Met à jour le groupe dans la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'idgroup',
            description: 'Entrer l\'Id du groupe à modifier',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'name',
            description: 'Enregistre le Prenom',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    runInteraction(client, interaction) {
        const updateidgroup = interaction.options.getString('idgroup');
        const updatename = interaction.options.getString('name');
        const embedupdategroup = new EmbedBuilder()
        .setColor('#B50B00')
        .addFields([{ name: 'Update Identité', value: `Mise à jour des informations effectué :`}]);

        db.query(`SELECT EXISTS( SELECT * FROM Groupe WHERE idgroupe='${updateidgroup}')`, function (err, result) {
            if (err) throw err; 
            //JSON.stringify(result[0]).substr(-2, 1);
            if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                interaction.reply({ content: `L\'Id du groupe : \`${updateidgroup}\` n\'existe pas`, ephemeral: true});
           } else {            
                db.query(`SELECT * FROM Groupe WHERE idgroupe='${updateidgroup}'`, function (error, resulta) {
                    if (error) throw error;
                    if (updatename) {
                        db.query(`UPDATE Groupe SET name = '${updatename.toLowerCase()}' WHERE idgroupe='${updateidgroup}'`)
                            embedupdategroup.addFields({
                                name: 'Nom du groupe :', value: `${resulta[0].name.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} à été changé en ==> ${updatename.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`
                            });
                        }
                    interaction.reply({ embeds: [embedupdategroup], ephemeral: true});
                });
            }
        });
    }
};