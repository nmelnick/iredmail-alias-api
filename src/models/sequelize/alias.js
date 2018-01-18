'use strict';

module.exports = (sequelize, DataTypes) => {
    const Alias = sequelize.define('Alias', {
        address: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: DataTypes.STRING,
        accesspolicy: DataTypes.STRING,
        domain: DataTypes.STRING,
        created: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW
        },
        modified: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW
        },
        expired: DataTypes.DATE,
        active: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    }, {
        createdAt: 'created',
        updatedAt: 'modified',
        freezeTableName: true,
        tableName: 'alias'
    });

    return Alias;
};
