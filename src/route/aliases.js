const express   = require('express');
const sequelize = require('../models/sequelize');
const models    = require('../models');
const schemas   = require('../schemas');
const responses = require('./responses');

const router = express.Router();

// GET /api/v1/aliases
router.get('/', (req, res) => {
    models.Alias.getDomains().then((domains) => {
        res.send(domains);
    });
});

// GET /api/v1/aliases/[domain_name]
router.get('/:domain', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();

    models.Alias.getAddressesForDomain(domain).then( (aliases) => {
        res.send(aliases);
    });
});

// GET /api/v1/aliases/[domain_name]/[username]
router.get('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();

    models.Alias.get(domain, username).then( (a) => {
        if (a == null) {
            responses.notExists(res);
        } else {
            res.send(a);
        }
    });
});

// POST /api/v1/aliases/[domain_name]/[username]
// This will create an instance
router.post('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();
    const address = username + '@' + domain;
    const body = req.body;

    const result = schemas.validate('alias', body);
    if (!result.valid) {
        responses.error(res, result.format(), 400);
        return;
    }

    models.Alias.get(domain, username).then( (a) => {
        if (a != null) {
            responses.exists(res);
        } else {
            const clone = {
                domain: domain,
                address: address,
                accesspolicy: body.accesspolicy,
                active: body.active != null ? (body.active ? 1 : 0) : 1
            };
            try {
                sequelize.Alias.create(clone);
                responses.ok(res, 201);
            } catch(error) {
                responses.error(res, error);
            }
        }
    });
});

// POST /api/v1/aliases/[domain_name]/[username]
// This will create or update an instance
router.put('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();
    const address = username + '@' + domain;
    const body = req.body;

    const result = schemas.validate('alias', body);
    if (!result.valid) {
        responses.error(res, result.format(), 400);
        return;
    }

    models.Alias.get(domain, username).then( (a) => {
        if (a == null) {
            const clone = {
                domain: domain,
                address: address,
                accesspolicy: body.accesspolicy,
                active: body.active != null ? (body.active ? 1 : 0) : 1
            };
            try {
                sequelize.Alias.create(clone);
                responses.ok(res, 201);
            } catch(error) {
                responses.error(res, error);
            }
        } else {
            if ("accesspolicy" in body) {
                a.accesspolicy = body.accesspolicy;
            }
            if ("active" in body) {
                a.active = body.active ? 1 : 0;
            }
            
            try {
                a.save().then(() => {
                    responses.ok(res, 200);
                })
            } catch(error) {
                responses.error(res, error);
            }
        }
    });
});

// DELETE /api/v1/aliases/[domain_name]/[username]
router.delete('/:domain/:username', (req, res) => {
    if (!schemas.validateParams(req, res, ['domain', 'username'])) {
        return;
    }

    const domain = req.params.domain.toLowerCase();
    const username = req.params.username.toLowerCase();

    models.Alias.get(domain, username).then( (a) => {
        if (a == null) {
            responses.notExists(res);
        } else {
            a.destroy();
            responses.ok(res);
        }
    });
});

module.exports = router;
