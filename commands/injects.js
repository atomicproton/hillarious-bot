const utils = require("../utils");
const {Op} = require('sequelize');

module.exports = {
    name: 'injects',
    usage: ['', '[minimum inject number]'],
    description: "Lists all injects for this guild",

    async execute(message, args) {
        const sequelize = message.client.dataManager.sequelize;

        let injects
        if (args.length > 0) {
            if (!utils.isNumber(args[0])) {
                message.channel.send("Could not read number");
                return;
            }
            injects = await sequelize.models.Inject.findAll({
                where: {
                    ServerServerId: message.guild.id,
                    number: {[Op.gte]: parseInt(args[0])},
                }, order: [
                    "number"
                ]
            });
        } else {
            injects = await sequelize.models.Inject.findAll({
                where: {
                    ServerServerId: message.guild.id,
                }, order: [
                    "number"
                ]
            });
        }

        const data = [`__**Injects:**__`];
        for (const inject of injects) {
            const minutesRemaining = ((inject.dueTime - Date.now()) / (1000 * 60)).toFixed(2);

            data.push(`__Inject **${inject.number}**: ${inject.name}__\n` +
                `   Due in ${minutesRemaining} minutes (${inject.dueTime})\n` +
                `   Finished?: ${utils.getBooleanText(inject.completed)}`);
        }

        await message.channel.send(data, {split: true});
    },
};
