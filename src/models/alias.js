'use strict';

const sequelize = require('./sequelize');

module.exports = {
    get: (domain, username) => {
        return new Promise( (resolve, reject) => {
            sequelize.Alias
                .findOne({
                    where: {
                        domain: domain,
                        address: username + '@' + domain
                    }
                })
                .then( (a) => {
                    resolve(a)
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    getDomains: () => {
        return new Promise( (resolve, reject) => {
            sequelize.Alias
                .aggregate('domain', 'DISTINCT', { plain: false })
                .then((ds) => {
                    resolve(ds.map( (d) => {
                        return { domain: d.DISTINCT };
                    }));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    getAddressesForDomain: (domain) => {
        return new Promise( (resolve, reject) => {
            sequelize.Alias
                .findAll({
                    where: { domain: domain }
                })
                .then( (aliases) => {
                    resolve(aliases.map( (a) => {
                        return { address: a.address }
                    }));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
};