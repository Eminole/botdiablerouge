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
    name: 'searchname',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Recherche les infos lié à un nom',
    //run(client, message, args) {},
    options: [
        {
            name: 'prenom',
            description: 'Entrer le Prenom',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'nom',
            description: 'Entrer le Nom.',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    runInteraction(client, interaction) {
        const searchprenom = interaction.options.getString('prenom');
        const searchnom = interaction.options.getString('nom');
        let text = '';
        let textinfo = '';
        let textplaque = '';
        let textvhtype = '';
        let textvhcolor = '';
        let textgroupe = '';
        const searchembed = new EmbedBuilder()
            .setTitle('Information :')
            .addFields(([
                { name: 'Prénom :', value: `${searchprenom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`, inline: true },
                { name: `Nom :`, value: `${searchnom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`, inline: true },
            ]))

        //Verif nom et prenom
        if ( searchprenom === null && searchnom !== null ) {
            return interaction.reply({ content: 'Erreur : vous n\'avez pas entré de prénom.', ephemeral: true});
        } else if ( searchprenom !== null && searchnom === null ) {
            return interaction.reply({ content: 'Erreur : vous n\'avez pas entré de nom.', ephemeral: true});
        } else if ( searchprenom !== null && searchnom !== null ) {
            db.query(`SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${searchprenom.toLowerCase()}' AND nom='${searchnom.toLowerCase()}')`, function (err, result) {
                if (err) throw err;
                //JSON.stringify(result[0]).substr(-2, 1);
                if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                    interaction.reply({ content: `${searchprenom.toLowerCase()} ${searchnom.toLowerCase()} n'existe pas`, ephemeral: true});
                } else {
                    db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${searchprenom.toLowerCase()}' AND nom='${searchnom.toLowerCase()}');SELECT DISTINCT info FROM Info WHERE id=@idname;SELECT DISTINCT Vehicule.* FROM Info,Vehicule WHERE id=@idname AND Info.plaque=Vehicule.plaque;SELECT DISTINCT Groupe.name FROM Info,Groupe WHERE id=@idname AND Info.idgroupe=Groupe.idgroupe`, function (err, resulta){
                        if (err) throw err;
                        if (resulta[1].length === 0 && resulta[2].length === 0 && resulta[3].length === 0) {
                            searchembed.addFields([
                                { name: 'Information :', value: `Aucune Information!`},
                            ])
                        } else {
                            if (resulta[1].length === 0) {
                                textinfo = `Aucune Information!`;
                            } else {
                                let infolength = resulta[1].length;
                                for (let i = 0 ;resulta[1].length !== 0; i++) {
                                    const firstelement = resulta[1].shift();
                                    if(firstelement.info === 'null' || firstelement.info === null) {
                                        if (infolength === 1) {textinfo = `Aucune Information!`;};
                                        text = text;
                                    } else {
                                        textinfo = `${textinfo}➡ ${firstelement.info}\n`;
                                    }
                                };
                            }
                            if (resulta[2].length === 0) {
                                textplaque = `Aucune Information!`;
                                textvhtype = `Aucune Information!`;
                                textvhcolor = `Aucune Information!`;
                            } else {
                                for (let i = 0 ;resulta[2].length !== 0; i++) {
                                    const firstelement = resulta[2].shift();
                                    if (firstelement.plaque === 'null' || firstelement.plaque === null) {
                                        text = text;
                                    } else {
                                        textplaque = `${textplaque}➡ ${firstelement.plaque}\n`;
                                        if (firstelement.type === 'null' || firstelement.type === null) {
                                            textvhtype = `${textvhtype}Inconnue\n`;
                                        } else {
                                            textvhtype = `${textvhtype}${firstelement.type}\n`;
                                        }                                
                                        if (firstelement.couleur === 'null' || firstelement.couleur === null) {
                                            textvhcolor = `${textvhcolor}Inconnue\n`;
                                        } else {
                                            textvhcolor = `${textvhcolor}${firstelement.couleur.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
                                        }                                
                                    }
                                };
                            }
                            if (resulta[3].length === 0) {
                                textgroupe = `Aucune Information!`;
                            } else {
                                for (let i = 0 ;resulta[3].length !== 0; i++) {
                                    const firstelement = resulta[3].shift();
                                    if (firstelement.name === 'null' || firstelement.name === null) {
                                        text = text;
                                    } else {
                                        textgroupe = `${textgroupe}➡ ${firstelement.name.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
                                    }
                                };
                            }
                            searchembed.addFields([
                                { name: 'Information :', value: `${textinfo}`},
                                { name: 'Plaque :', value: `${textplaque}`, inline: true},
                                { name: 'Type :', value: `${textvhtype}`, inline: true},
                                { name: 'Couleur :', value: `${textvhcolor}`, inline: true},
                                { name: 'Groupe :', value: `${textgroupe}`}
                            ])
                        }
                        interaction.reply( {embeds: [searchembed], ephemeral: true} );
                    });   
                }
            });
        };
    }
};