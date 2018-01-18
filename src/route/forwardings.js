const express   = require('express');
const sequelize = require('../models/sequelize');
const models    = require('../models');
const schemas   = require('../schemas');
const responses = require('./responses');

const router = express.Router();

// GET /api/v1/forwardings
router.get('/', (req, res) => {
    models.Forwarding.getDomains().then((domains) => {
        res.send(domains);
    });
});

// GET /api/v1/forwardings/[domain_name]
router.get('/:domain', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();

    models.Forwarding.getAddressesForDomain(domain).then( (aliases) => {
        res.send(aliases);
    });
});

// GET /api/v1/forwardings/[domain_name]/[username]
router.get('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();

    models.Forwarding.get(domain, username).then( (a) => {
        if (a == null) {
            responses.notExists(res);
        } else {
            res.send(a);
        }
    });
});

// POST /api/v1/forwardings/[domain_name]/[username]
// This will create an instance
router.post('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();
    const address = username + '@' + domain;
    const body = req.body;

    const result = schemas.validate('forwarding', body);
    if (!result.valid) {
        responses.error(res, result.format(), 400);
        return;
    }

    models.Alias.get(domain, username).then( (a) => {
        if (a != null) {
            models.Forwarding.get(domain, username).then( (f) => {
                if (f != null) {
                    responses.exists(res);
                } else {
                    const destDomain = body.forwarding.substring( body.forwarding.lastIndexOf('@') + 1 );
                    const clone = {
                        domain: domain,
                        address: address,
                        forwarding: body.forwarding,
                        dest_domain: destDomain,
                        is_forwarding: 1
                    };
                    try {
                        sequelize.Forwarding.create(clone);
                        responses.ok(res, 201);
                    } catch(error) {
                        responses.error(res, error);
                    }
                }
            });
        } else {
            responses.error(res, "No alias domain/user exists", 400);
        }
    });

});

// PUT /api/v1/forwardings/[domain_name]/[username]
// This will create or update an instance
router.put('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();
    const address = username + '@' + domain;
    const body = req.body;

    const result = schemas.validate('forwarding', body);

    models.Alias.get(domain, username).then( (a) => {
        if (a != null) {
            models.Forwarding.get(domain, username).then( (f) => {
                if (f == null) {
                    const destDomain = body.forwarding.substring( body.forwarding.lastIndexOf('@') + 1 );
                    const clone = {
                        domain: domain,
                        address: address,
                        forwarding: body.forwarding,
                        dest_domain: destDomain,
                        is_forwarding: 1
                    };
                    try {
                        sequelize.Forwarding.create(clone);
                        responses.ok(res, 201);
                    } catch(error) {
                        responses.error(res, error);
                    }
                } else {
                    if ("forwarding" in body) {
                        const destDomain = body.forwarding.substring( body.forwarding.lastIndexOf('@') + 1 );
                        f.forwarding = body.forwarding;
                        f.dest_domain = destDomain;
                    }
                    
                    try {
                        f.save().then(() => {
                            responses.ok(res, 200);
                        });
                    } catch(error) {
                        responses.error(res, error);
                    }
                }
            });
        } else {
            responses.error(res, "No alias domain/user exists", 400);
        }
    });
});

// DELETE /api/v1/forwardings/[domain_name]/[username]
router.delete('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();

    models.Forwarding.get(domain, username).then( (f) => {
        if (f == null) {
            responses.notExists(res);
        } else {
            f.destroy();
            responses.ok(res);
        }
    });
});

module.exports = router;
