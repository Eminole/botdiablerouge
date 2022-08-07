const { promisify } = require('util');
const { glob } = require ('glob');
const { PermissionsBitField } = require('discord.js');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async cmdFile => {
        const cmd = require(cmdFile);

        if (!cmd.name || !cmd.description) return console.log(`-------\nCommannde non-declenché: pas de nom et/ou description\nFichier ---> ${cmdFile}\n-------`);
        if (!cmd.category) return console.log(`-------\nCommannde non-declenché: pas de catégorie\nFichier ---> ${cmdFile}\n-------`);
        if (!cmd.permissions) return console.log(`-------\nCommannde non-declenché: pas de permission\nFichier ---> ${cmdFile}\n-------`);

        client.commands.set(cmd.name, cmd);
        console.log(`Commande chargée : ${cmd.name}`);
    });
};