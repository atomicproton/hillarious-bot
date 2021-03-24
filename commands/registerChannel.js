const {prefix} = require('../config.json');

module.exports = {
    name: 'registerchannel',
    description: 'Registers this discord channel as the notifications channel',
    usage: '',
    permissions: ["MANAGE_GUILD "],
    guildOnly: true,

    execute(message, args) {
        message.client.dataManager.sequelize.models.Server.upsert({
            serverId: message.channel.guild.id,
            notificationChannelId: message.channel.id,
        });

        message.channel.send(`Successfully registered ${message.channel.toString()} as the notifications channel`)
    },
};
