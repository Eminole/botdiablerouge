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
    name: 'updateid',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Met à jour l\'identité dans la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'id',
            description: 'Entrer l\'Id à modifier',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'prenom',
            description: 'Enregistre le Prenom à modifier',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'nom',
            description: 'Enregistre le Nom à modifier.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'age',
            description: 'Enregistre l\'age à modifier.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'sang',
            description: 'Enregistre le groupe sanguin à modifier.',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    runInteraction(client, interaction) {
        const updateid = interaction.options.getString('id');
        const updateprenom = interaction.options.getString('prenom');
        const updatenom = interaction.options.getString('nom');
        const updateage = interaction.options.getString('age');
        const updatesang = interaction.options.getString('sang');
        const embedupdateid = new EmbedBuilder()
        .setColor('#B50B00')
        .addFields([{ name: 'Update Identité', value: `Mise à jour des informations effectué :`}]);

        db.query(`SELECT EXISTS( SELECT * FROM Identite WHERE Id='${updateid}')`, function (err, result) {
            if (err) throw err; 
            //JSON.stringify(result[0]).substr(-2, 1);
            if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                interaction.reply({ content: `L\'Id : \`${updateid}\` n\'existe pas`, ephemeral: true});
           } else {            
                db.query(`SELECT * FROM Identite WHERE Id='${updateid}'`, function (error, resulta) {
                    if (error) throw error;
                    if (updateprenom) {
                        db.query(`UPDATE Identite SET prenom = '${updateprenom.toLowerCase()}' WHERE Id='${updateid}'`)
                            embedupdateid.addFields({
                                name: 'Prénom :', value: `${resulta[0].prenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} à été changé en ==> ${updateprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`
                            });
                    };
                    if (updatenom) {
                        db.query(`UPDATE Identite SET nom = '${updatenom.toLowerCase()}' WHERE Id='${updateid}'`)
                            embedupdateid.addFields({
                                name: 'Nom :', value: `${resulta[0].nom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} à été changé en ==> ${updatenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`
                            });
                    };
                    if (updateage) {
                        db.query(`UPDATE Identite SET age = '${updateage}' WHERE Id='${updateid}'`)
                            embedupdateid.addFields({
                                name: 'Age :', value: `${resulta[0].age} à été changé en ==> ${updateage}`
                            });
                    };
                    if (updatesang) {
                        db.query(`UPDATE Identite SET sang = '${updatesang}' WHERE Id='${updateid}'`)
                            embedupdateid.addFields({
                                name: 'Prénom :', value: `${resulta[0].sang} à été changé en ==> ${updatesang}`
                            });                        
                    };
                    interaction.reply({ embeds: [embedupdateid], ephemeral: true});
                });
            }
        });
    }
};