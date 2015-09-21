'use strict';
module.exports = function(sequelize, DataTypes){
    var Deploy = sequelize.define('Deploy', {
        deployStatus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logFile: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deployUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        awsAccessKeyId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        awsSecretAccessKey: {
            type: DataTypes.STRING,
            allowNull: true
        },
        awsVpcId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        awsRegion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        awsSubnetId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        htmlUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gitUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        gitBranch: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dockerFile: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        },
        dockerCompose: {
            type: DataTypes.TEXT('long'),
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                Deploy.belongsTo(models.App, {
                    onDelete: 'CASCADE',
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });

    return Deploy;
};
