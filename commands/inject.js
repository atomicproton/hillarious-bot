const {prefix} = require('../config.json');
const utils = require("../utils");

module.exports = {
    name: 'inject',
    usage: ['', 'create [number] [minutes until due] [name]', 'finish [number]', 'subscribe [number] [?user = you]', 'unsubscribe [number] [?user = you]',
        'delete [number]', 'ping [number]'],


    async execute(message, args) {
        const sequelize = message.client.dataManager.sequelize;

        const serverInfo = await sequelize.models.Server.findAll({
            where: {
                serverId: message.guild.id
            }
        });

        if (serverInfo.length === 0) {
            message.channel.send(`You have not registered a notification channel yet. Try running \`${prefix}registerchannel\` in a channel`);
            return;
        }

        if (!args || args.length < 1) {
            message.channel.send(`try \`${prefix}inject [create|finish|subscribe|unsubscribe|delete|ping]\``);
            return;
        }

        const action = args.shift().toLowerCase();
        if (args.length < 1) {
            if (!utils.isNumber(args[0])) {
                message.channel.send(`Could not read that inject number`);
                return;
            }
        }
        const injectNumber = parseInt(args[0]);
        const prevInjects = await sequelize.models.Inject.findAll({
            where: {
                ServerServerId: message.guild.id,
                number: injectNumber,
            }
        });

        if (action === "create") {
            if (prevInjects.length !== 0) {
                message.channel.send(`Inject number ${injectNumber} already exists`);
                return;
            }
            if (args.length < 3) {
                message.channel.send(`Missing arguments`);
                return;
            }
            if (!utils.isNumber(args[1])) {
                message.channel.send(`Could not read the minutes until the inject is due`);
                return;
            }
            const minutesTilDue = parseInt(args[1]);
            const timeDue = Date.now() + (minutesTilDue * 60 * 1000);
            const name = args.slice(2).join(" ");

            await sequelize.models.Inject.create({
                number: injectNumber,
                name: name,
                dueTime: timeDue,
                ServerServerId: message.guild.id
            });

            message.channel.send(`Created inject ${injectNumber}: ${name}`);
        } else if (action === "finish") {
            if (prevInjects.length === 0) {
                message.channel.send(`Inject number ${injectNumber} not found`);
                return;
            }

            if (prevInjects[0].completed) {
                message.channel.send(`Inject number ${injectNumber} already finished`);
                return;
            }

            await sequelize.models.Inject.update({
                completed: true
            }, {
                where: {
                    number: injectNumber,
                    ServerServerId: message.guild.id
                }
            });

            message.channel.send(`Finished inject ${injectNumber}`);
        } else if (action === "delete") {
            if (prevInjects.length === 0) {
                message.channel.send(`Inject number ${injectNumber} not found`);
                return;
            }

            await sequelize.models.Inject.destroy({
                where: {
                    number: injectNumber,
                    ServerServerId: message.guild.id
                }
            });

            message.channel.send(`Deleted inject ${injectNumber}`);
        } else if (action === "subscribe") {
            if (prevInjects.length === 0) {
                message.channel.send(`Inject number ${injectNumber} not found`);
                return;
            }

            let user;
            if (args.length === 1) {
                user = message.author;
            } else {
                user = await utils.parseUser(args[1], message.guild);

                if (!user) {
                    message.channel.send(`User \`${args[1]}\` not found`);
                    return;
                }
            }

            const prevSubscriber = await sequelize.models.Subscriber.findAll({
                where: {
                    userId: user.id,
                    InjectId: prevInjects[0].id
                }
            });

            if(prevSubscriber.length > 0) {
                message.channel.send(`<@${user.id}> is already subscribed to inject ${injectNumber}`);
                return;
            }

            console.log(prevInjects[0].id);
            await sequelize.models.Subscriber.create({
                userId: user.id,
                InjectId: prevInjects[0].id
            });

            message.channel.send(`Successfully subscribed`);
        }else if (action === "unsubscribe") {
            if (prevInjects.length === 0) {
                message.channel.send(`Inject number ${injectNumber} not found`);
                return;
            }

            let user;
            if (args.length === 1) {
                user = message.author;
            } else {
                user = await utils.parseUser(args[1], message.guild);

                if (!user) {
                    message.channel.send(`User \`${args[1]}\` not found`);
                    return;
                }
            }

            const prevSubscriber = await sequelize.models.Subscriber.findAll({
                where: {
                    userId: user.id,
                    InjectId: prevInjects[0].id
                }
            });

            if(prevSubscriber.length === 0) {
                message.channel.send(`<@${user.id}> is not already subscribed to inject ${injectNumber}`);
                return;
            }

            console.log(prevInjects[0].id);
            await sequelize.models.Subscriber.destroy({
                where: {
                    userId: user.id,
                    InjectId: prevInjects[0].id
                }
            });

            message.channel.send(`Successfully unsubscribed`);
        } else if (action === "ping") {
            if (prevInjects.length === 0) {
                message.channel.send(`Inject number ${injectNumber} not found`);
                return;
            }

            const prevSubscribers = await sequelize.models.Subscriber.findAll({
                where: {
                    InjectId: prevInjects[0].id
                }
            });

            if(prevSubscribers.length === 0) {
                await message.channel.send(`No subscribers found for inject ${prevInjects[0].number}`);
                return
            }

            const pings = [`__**Inject ${prevInjects[0].number}:**__`];
            for(const subscriber of prevSubscribers) {
                pings.push(`<@${subscriber.userId}>`);
            }

            await message.channel.send(pings, {split: true});
        } else {
            message.channel.send(`Could not find option \`${action}\``);
        }

    },
};
