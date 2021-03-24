const config = require('./config.json');
const Discord = require("discord.js");

/**
 * Gets a random value from the given array
 * @param list {[]}
 * @returns {*}
 */
function getRandom(list) {
    const random = Math.floor(Math.random() * list.length);
    return list[random];
}

/**
 * Checks if a string is a number
 * @param text {String}
 * @returns {boolean}
 */
function isNumber(text) {
    if (text) {
        return text.match(/^[0-9]+$/) !== null;
    } else {
        return false;
    }
}

/**
 * Parses command input. Separates each value in the string by spaces and places each value in an array. Ignores spaces
 * in quotes.
 * Function written by https://github.com/aopell
 * @param input {String}
 * @returns {[String]}
 */
function parseArguments(input) {
    input = input.slice(config.prefix.length).trim();
    const args = [];
    let currentString = "";
    let insideQuote = false;
    for (let i = 0; i < input.length; i++) {
        if (!insideQuote && input[i] === ' ') {
            args.push(currentString);
            currentString = '';
        } else if (input[i] === '"') {
            if (insideQuote) {
                args.push(currentString);
                currentString = '';
                insideQuote = false;
                if (i < input.length - 1 && input[i + 1] === ' ') {
                    i++;
                }
            } else {
                insideQuote = true;
            }
        } else if (input[i] === '\\' && i < input.length - 1) {
            switch (input[i + 1]) {
                case '\\':
                    currentString += '\\';
                    i++;
                    break;
                case '"':
                    currentString += '"';
                    i++;
                    break;
                default:
                    currentString += '\\';
                    break;
            }
        } else {
            currentString += input[i];
        }
    }
    if (currentString.trim() !== '') {
        args.push(currentString);
    }

    return args;
}


/**
 * Gets a guildMember for the given text
 * @param text {String}
 * @param guild {Discord.Guild}
 * @returns {Discord.GuildMember}
 */
async function parseUser(text, guild) {
    if (!text) {
        return null;
    }

    if (isNumber(text)) {
        // Probably an id
        try {
            return await guild.members.fetch(text);
        } catch (err) {
            return null;
        }
    }

    const query = await guild.members.fetch({ query: text, limit: 1 });
    if(query.size === 0) {
        return null
    } else {
        return query.values().next().value;
    }
}

function getBooleanText(input) {
    if (input) {
        return "✅ Yes";
    } else {
        return "❌ No";
    }
}

module.exports = {getRandom, isNumber, parseArguments, parseUser, getBooleanText};
