const dotenv = require('dotenv'); dotenv.config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Je suis prêt!');

        const devGuild = await client.guilds.cache.get(process.env.ID_DISCORD_TOKEN);// ID Serveur
        devGuild.commands.set(client.commands.map(cmd => cmd));
    }
}