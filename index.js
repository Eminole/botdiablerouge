const { Client, GatewayIntentBits, Collection, DisallowedIntents } = require("discord.js");
const dotenv = require('dotenv'); dotenv.config();
const mongoose = require('mongoose');
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

mongoose.connect(process.env.DATABASE_URI, {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}).then(() => { console.log('Le client est connecté à la base de données!'); })
.catch( err => { console.log(err); });

client.login(process.env.DISCORD_TOKEN);