module.exports = {
  name: 'guildMemberAdd',
  once: false,
  async execute(client, member) {
    member.roles.add('1005856960278708335');//role d'arrivé
  },
};