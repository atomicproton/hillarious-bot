const config = require("./config.json");
const commands = require("./modules/commands");
const Discord = require("discord.js");
const DataManager = require("./data/dataManager");

async function init() {
    console.log("Starting...");


    // Setup discord
    const client = new Discord.Client();

    // Set up DB
    const dataManager = await new DataManager("data.sqlite");
    await dataManager.syncTables();
    client.dataManager = dataManager;

    await client.login(config.token);
    commands.registerCommands(client);
    client.once("ready", () => {
        console.log("Bot started");
    });

    client.on('message', message => {
        commands.runCommand(client, message);
    });
}

init().catch((e) => {
    console.log(e);
});
