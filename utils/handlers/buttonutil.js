const { promisify } = require('util');
const { glob } = require ('glob');
const { PermissionsBitField } = require('discord.js');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/buttons/*/*.js`)).map(async btnFile => {
        const btn = require(btnFile);

        if (!btn.name) return console.log(`-------\nbouton non-fonctionnelle: pas de nom et/ou description\nFichier ---> ${btnFile}\n-------`);

        client.buttons.set(btn.name, btn);
    });
};