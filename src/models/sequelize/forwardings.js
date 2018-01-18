'use strict';

module.exports = (sequelize, DataTypes) => {
    const Forwarding = sequelize.define('Forwarding', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: DataTypes.STRING,
        forwarding: DataTypes.STRING,
        domain: DataTypes.STRING,
        dest_domain: DataTypes.STRING,
        is_list: DataTypes.INTEGER,
        is_forwarding: DataTypes.INTEGER,
        is_alias: DataTypes.INTEGER,
        active: DataTypes.INTEGER
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'forwardings'
    });

    return Forwarding;
};
