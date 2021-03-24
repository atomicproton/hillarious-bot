const {Sequelize, DataTypes} = require('sequelize');

module.exports = {
    /**
     * @param sequelize {Sequelize}
     */
    register(sequelize) {
        return sequelize.define("Server", {
            serverId: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            notificationChannelId: {
                type: DataTypes.STRING
            }
        })
    }
}