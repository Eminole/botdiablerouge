const prefix = '!';

module.exports = {
    name: 'messageCreate',
    execute(client, message) {
        if(message.author.bot) return;
        if(!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        console.log(args);
        const cmdname = args.shift().toLowerCase();
        console.log(cmdname);
        if (cmdname.length == 0) return;

        let cmd = client.commands.get(cmdname);

        if (!message.member.permissions.has([cmd.permissions])) return message.reply( `Vous n'avez pas la/les permission(s) requise(s) (\`${message.member.permissions.missing([cmd.permissions])}\`) pour utiliser cette commande!` );

        if (cmd) cmd.run(client, message, args);
    },
};