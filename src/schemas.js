'use strict';

const inspector = require('schema-inspector');
const responses = require('./route/responses');

// Schema definitions for inbound data objects
const schemas = {
    alias: {
        type: 'object',
        properties: {
            accesspolicy: {
                type: 'string',
                optional: true,
                rules: ['trim']
            },
            active: {
                type: 'boolean',
                optional: true
            }
        }
    },
    forwarding: {
        type: 'object',
        properties: {
            forwarding: {
                type: 'string',
                minLength: 3,
                pattern: 'email',
                rules: ['trim']
            },
        }
    }
};

module.exports = {
    validate: (schema, data) => {
        inspector.sanitize(schemas[schema], data);
        return inspector.validate(schemas[schema], data);
    },
    validateParams: (req, res, params) => {
        let valid = true;
        params.forEach(p => {
            if (p in req.params) {
                switch(p) {
                    case 'domain':
                        if (req.params[p].match(/^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/) == null) {
                            responses.error(res, 'Invalid ' + p, 400);
                            valid = false;
                        }
                        break;
                    case 'username':
                        if (req.params[p].match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+$/) == null) {
                            responses.error(res, 'Invalid ' + p, 400);
                            valid = false;
                        }
                        break;
                }
            } else {
                responses.error(res, 'Missing or invalid ' + p, 400);
                valid = false;
            }
        });
        return valid;
    }
};
