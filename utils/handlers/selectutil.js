const { promisify } = require('util');
const { glob } = require ('glob');
const { PermissionsBitField } = require('discord.js');
const pGlob = promisify(glob);

module.exports = async client => {
    (await pGlob(`${process.cwd()}/selectmenus/*/*.js`)).map(async selectmenuFile => {
        const selectmenu = require(selectmenuFile);

        if (!selectmenu.name) return console.log(`-------\nSelectmenu non-fonctionel: pas de nom et/ou description\nFichier ---> ${selectmenuFile}\n-------`);

        client.selectmenus.set(selectmenu.name, selectmenu);
    });
};