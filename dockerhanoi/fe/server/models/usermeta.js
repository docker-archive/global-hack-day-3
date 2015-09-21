'use strict';

module.exports = function(sequelize, DataTypes) {
    var Usermeta = sequelize.define('Usermeta', {
        metaKey: DataTypes.STRING,
        metaValue: DataTypes.TEXT('long')
    }, {
        classMethods: {
            associate: function(models) {
                Usermeta.belongsTo(models.User, {
                    onDelete: 'CASCADE',
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        },
        timestamps: false
    });

    return Usermeta;
};
