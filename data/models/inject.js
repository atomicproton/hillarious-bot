const {Sequelize, DataTypes} = require('sequelize');

module.exports = {
    /**
     * @param sequelize {Sequelize}
     */
    register(sequelize) {
        return sequelize.define("Inject", {
            number: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: DataTypes.TEXT
            },
            dueTime: {
                type: DataTypes.DATE
            },
            completed: {
                type: DataTypes.BOOLEAN
            }
        })
    }
}