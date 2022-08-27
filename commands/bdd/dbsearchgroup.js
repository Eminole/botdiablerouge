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
    name: 'searchgroup',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.CreatePrivateThreads],
    description: 'Recherche les infos lié à un groupe',
    //run(client, message, args) {},
    options: [
        {
            name: 'groupe',
            description: 'Entrer le groupe',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    runInteraction(client, interaction) {
        const searchgroup = interaction.options.getString('groupe');
        let text = '';
        let textinfo = '';
        let textplaque = '';
        let textvhtype = '';
        let textvhcolor = '';
        let textname = '';
        const searchembed = new EmbedBuilder()
            .setTitle('Information :')
            .addFields(([
                { name: 'Groupe :', value: `${searchgroup.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`, inline: true }
            ]))

        //Verif nom et prenom
        if ( searchgroup !== null ) {
            db.query(`SELECT EXISTS( SELECT * FROM Groupe WHERE name='${searchgroup}')`, function (err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result[0]).substr(-2, 1));
                if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                    interaction.reply({ content: `${searchgroup.toLowerCase()} n'existe pas`, ephemeral: true});
                } else {
                    db.query(`SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${searchgroup.toLowerCase()}');SELECT DISTINCT info FROM Info WHERE idgroupe=@idgroup;SELECT DISTINCT Vehicule.* FROM Info,Vehicule WHERE idgroupe=@idgroup AND Info.plaque=Vehicule.plaque;SELECT DISTINCT Identite.* FROM Info,Identite WHERE idgroupe=@idgroup AND Info.id=Identite.Id`, function (err, resulta){
                        if (err) throw err;
                        if (resulta[1].length === 0 && resulta[2].length === 0 && resulta[3].length === 0) {
                            searchembed.addFields([
                                { name: 'Information :', value: `Aucune Information!`},
                            ])
                        } else {
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
                                textname = `Aucune Information!`;
                            } else {
                                for (let i = 0 ;resulta[3].length !== 0; i++) {
                                    const firstelement = resulta[3].shift();
                                    if (firstelement.name === 'null' || firstelement.name === null) {
                                        text = text;
                                    } else {
                                        textname = `${textname}➡ ${firstelement.prenom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())} ${firstelement.nom.replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`;
                                    }
                                };
                            }
                            searchembed.addFields([
                                { name: 'Membre(s) :', value: `${textname}`},
                                { name: 'Plaque :', value: `${textplaque}`, inline: true},
                                { name: 'Type :', value: `${textvhtype}`, inline: true},
                                { name: 'Couleur :', value: `${textvhcolor}`, inline: true}                               
                            ])
                        }
                        interaction.reply( {embeds: [searchembed], ephemeral: true} );
                    });   
                }
            });
        };
    }
};