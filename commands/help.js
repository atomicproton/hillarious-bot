const {prefix} = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Get a list of commands or info about a specific command.',
    usage: '[command name]',

    execute(message, args) {
        const data = [];
        const {commands} = message.client;

        if (args.length === 0) { // List all commands
            data.push("**Commands**");
            for (const commandName of commands.keys()) {
                const command = commands.get(commandName);
                if (command.admin) {
                    // Don't show admin commands in the help menu
                    continue;
                }

                let usage;
                if (command.usage) {
                    const usages = [].concat(command.usage);
                    usage = usages[0];
                } else {
                    usage = "";
                }
                data.push(`- ${prefix}${command.name} ${usage}`);
            }
            data.push(`Try \`${prefix}help [command name]\` to get info on a specific command`);

            return message.channel.send(data, {split: true});
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.guildOnly) data.push(`**Guild only:** ${command.guildOnly || false}`);
        if (command.usage) {
            const usages = [].concat(command.usage);
            for (const usage of usages) {
                data.push(`**Usage:** ${prefix}${command.name} ${usage}`);
            }
        }

        message.channel.send(data, {split: true});
    },
};
