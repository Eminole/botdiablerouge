const { Client, GatewayIntentBits, Collection, DisallowedIntents } = require("discord.js");
const dotenv = require('dotenv'); dotenv.config();
const mysql = require('mysql');
const selectutil = require("./utils/handlers/selectutil");
const client = new Client({ intents: 3276799 });

client.commands = new Collection();
client.buttons = new Collection();
client.selectmenus = new Collection();
['commandutil', 'eventutil', 'buttonutil', 'selectutil'].forEach(handler => { require(`./utils/handlers/${handler}`)(client) });

process.on('exit', code => { console.log(`Le processus s'est arrété avec le code: ${code}`) });
process.on('uncaughtException', (err, origin) => { console.log(`UNCAUGHT_EXCEPTION: ${err}`, `origine: ${origin}`) });
process.on('unhandledRejection', (reason, promise) => { console.log(`UNHANDLED_REJECTION: ${reason}\n-------\n`, promise) });
process.on('warning', (...args) => { console.log(...args) });


const db = new mysql.createConnection({
    host: process.env.DB_HOST_TOKEN,
    password: process.env.DB_PWD_TOKEN,
    user: process.env.DB_USER_TOKEN,
    database: process.env.DB_NAME_TOKEN,
    port: process.env.DB_PORT_TOKEN
});
db.connect(function (err) {
    if (err) throw err;

    console.log('Le client est connecté à la base de données!');
})


client.login(process.env.DISCORD_TOKEN);