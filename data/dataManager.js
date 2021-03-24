const Sequelize = require('sequelize');

module.exports = class dataManager {
    sequelize;

    constructor(fileName) {
        this.sequelize = new Sequelize.Sequelize({
            dialect: 'sqlite',
            storage: fileName
        });

        const servers = require("./models/server").register(this.sequelize);
        const injects = require("./models/inject").register(this.sequelize);
        const subscribers = require("./models/subscriber").register(this.sequelize);

        servers.hasMany(injects, {
            foreignKey: {
                allowNull: false
            }
        });
        injects.hasMany(subscribers, {
            foreignKey: {
                allowNull: false
            }
        });
    }

    async syncTables() {
        // TODO: {alter: true} can be destructive
        await this.sequelize.sync({alter: false}); // Creates tables. Alter updates the tables to have the right columns/types
        // console.log(await this.#sequelize.models.Server.create({serverId: "1"}));
        // console.log(await this.#sequelize.models.Inject.create({number: 1}));
    }
}