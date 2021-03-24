const {Sequelize, DataTypes} = require('sequelize');

module.exports = {
    /**
     * @param sequelize {Sequelize}
     */
    register(sequelize) {
        return sequelize.define("Subscriber", {
            // injectId: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false
            // },
            userId: {
                type: DataTypes.STRING,
                allowNull: false
            }
        })
    }
}