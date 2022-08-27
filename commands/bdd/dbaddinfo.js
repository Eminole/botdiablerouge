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
    name: 'addinfo',
    category: 'bdd',
    permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageWebhooks],
    description: 'Ajoute des infos à la base de donnée',
    //run(client, message, args) {},
    options: [
        {
            name: 'prenom',
            description: 'Enregistre le Prenom',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'nom',
            description: 'Enregistre le Nom.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'plaque',
            description: 'Enregistre la plaque.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'groupname',
            description: 'Enregistre le nom du groupe.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'info',
            description: 'Enregistre diverse info.',
            type: ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    runInteraction(client, interaction) {
        const addprenom = interaction.options.getString('prenom');
        const addnom = interaction.options.getString('nom');
        const addplaque = interaction.options.getString('plaque');
        const addgrpname = interaction.options.getString('groupname');
        const addinfo = interaction.options.getString('info');

        //Verif nom et prenom
        if ( addprenom === null && addnom !== null ) {
            return interaction.reply({ content: 'Erreur : vous n\'avez pas entré de prénom.', ephemeral: true});
        } else if ( addprenom !== null && addnom === null ) {
            return interaction.reply({ content: 'Erreur : vous n\'avez pas entré de nom.', ephemeral: true});
        } else if ( addprenom !== null && addnom !== null ) {
            if ( addplaque !== null ) {
                if ( addgrpname !== null ) {
                    if ( addinfo !== null ) {
                        db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')) = 0 || (SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}' )) = 0 || (SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque.toLowerCase()}" , @idgroup)`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nPlaque : ${addplaque.toUpperCase()}\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nInformation Divers : ${addinfo}`, ephemeral: true});
                            }
                        });
                    } else {
                        db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')) = 0 || (SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}' )) = 0 || (SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque.toLowerCase()}" , @idgroup)`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nPlaque : ${addplaque.toUpperCase()}\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}`, ephemeral: true});
                            }
                        });
                    }
                } else {
                    if ( addinfo !== null ) {
                        db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')) = 0 || (SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque.toLowerCase()}" , ${addgrpname})`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nPlaque : ${addplaque.toUpperCase()}\nInformation Divers : ${addinfo}`, ephemeral: true});
                            }
                        });
                    } else {
                        db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')) = 0 || (SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque.toLowerCase()}" , ${addgrpname})`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nPlaque : ${addplaque.toUpperCase()}`, ephemeral: true});
                            }
                        });  
                    }
                }
            } else {
                if ( addgrpname !== null ) {
                    if ( addinfo !== null ) {//pas de plaque 
                        db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')) = 0 || (SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque}" , @idgroup)`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nInformation Divers : ${addinfo}`, ephemeral: true});
                            }
                        });
                    } else {//pas de plaque , info
                        db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')) = 0 || (SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque}" , @idgroup)`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`, ephemeral: true});
                            }
                        });    
                    }
                } else {
                    if ( addinfo !== null ) {//pas de plaque, groupe
                        db.query(`SELECT EXISTS( SELECT * FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}')`, function (err, result) {
                            if (err) throw err;
                            if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                                interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                            } else {
                                db.query(`SELECT @idname := (SELECT Id FROM Identite WHERE prenom='${addprenom.toLowerCase()}' AND nom='${addnom.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,@idname ,"${addplaque}" , ${addgrpname})`);
                                interaction.reply({ content: `Liaison d'information rajouté :\nPrenom : ${addprenom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nNom : ${addnom.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nInformation Divers : ${addinfo}`, ephemeral: true});
                            }
                        });
                    } else {//jsute nom
                        interaction.reply({ content: `Il faut rajouter des infos en plus du prenom et nom.`, ephemeral: true});
                    }                    
                }
            }
        } else if ( addplaque !== null ) {
            if ( addgrpname !== null ) {
                if ( addinfo !== null ) {//pas de nom
                    db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}' )) = 0 || (SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                        if (err) throw err;
                        if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                            interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                        } else {
                            db.query(`SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,${addprenom} ,"${addplaque.toLowerCase()}" , @idgroup)`);
                            interaction.reply({ content: `Liaison d'information rajouté :\nPlaque : ${addplaque.toUpperCase()}\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nInformation Divers : ${addinfo}`, ephemeral: true});
                        }
                    });
                } else {//pas de nom, info
                    db.query(`SELECT IF ( (SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}' )) = 0 || (SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}' )) = 0 , '0' ,'1' )`, function (err, result) {
                        if (err) throw err;
                        if (JSON.stringify(result[0]).substr(-3, 1) === "0") {
                            interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                        } else {
                            db.query(`SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,${addprenom} ,"${addplaque.toLowerCase()}" , @idgroup)`);
                            interaction.reply({ content: `Liaison d'information rajouté :\nPlaque : ${addplaque.toUpperCase()}\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\n`, ephemeral: true});
                        }
                    });
                }
            } else {
                if ( addinfo !== null ) {//pas de nom,groupe
                    db.query(`SELECT EXISTS( SELECT * FROM Vehicule WHERE plaque='${addplaque.toLowerCase()}')`, function (err, result) {
                        if (err) throw err;
                        if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                            interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                        } else {
                            db.query(`INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,${addprenom} ,"${addplaque.toLowerCase()}" , ${addgrpname})`);
                            interaction.reply({ content: `Liaison d'information rajouté :\nPlaque : ${addplaque.toUpperCase()}\nInformation Divers : ${addinfo}`, ephemeral: true});
                        }
                    });
                } else {//jsute plaque
                    interaction.reply({ content: `Il faut rajouter des infos en plus de la plaque.`, ephemeral: true});
                }
            }
        } else if ( addgrpname !== null ) {//juste groupe, info
            if ( addinfo !== null ) {
                db.query(`SELECT EXISTS( SELECT * FROM Groupe WHERE name='${addgrpname.toLowerCase()}')`, function (err, result) {
                    if (err) throw err;
                    if (JSON.stringify(result[0]).substr(-2, 1) === "0") {
                        interaction.reply({ content: `Erreur de saisie dans les données`, ephemeral: true});
                    } else {
                        db.query(`SELECT @idgroup := (SELECT idgroupe FROM Groupe WHERE name='${addgrpname.toLowerCase()}');INSERT INTO Info(info, id, plaque, idgroupe) VALUES ("${addinfo}" ,${addprenom} ,"${addplaque}" , @idgroup)`);
                        interaction.reply({ content: `Liaison d'information rajouté :\nGroupe : ${addgrpname.toLowerCase().replace(/(^\w|\s\w)/g, firstLetter => firstLetter.toUpperCase())}\nInformation Divers : ${addinfo}`, ephemeral: true});
                    }
                });             
            } else {//groupe
                interaction.reply({ content: `Il faut rajouter des infos en plus du groupe.`, ephemeral: true});
            }
        } else if ( addinfo !== null ) {// info
            interaction.reply({ content: `Il faut rajouter des infos en plus des infos diverses`, ephemeral: true});
        } else {
            return interaction.reply({ content: `Aucune option entrée!`, ephemeral: true});
        };
    }
};