const express   = require('express');
const sequelize = require('../models/sequelize').sequelize;

const router = express.Router();

// GET /up
router.get('/', (req, res) => {
    res.send('OK');
});

// GET /up/full
router.get('/full', (req, res) => {
    let status = {
        "status": "OK",
        "database": "OK",
        "errors": []
    };
    sequelize
        .authenticate()
        .then((errors) => {
            if (errors) {
                status.status = "ERROR";
                status.database = "ERROR";
                status.errors = errors;
                res.status = 500;
            }
            res.send(status);
        })
        .catch((err) => {
            status.status = "ERROR";
            status.database = "ERROR";
            status.errors = [err];
            res.status = 500;
            res.send(status);
        });
});

module.exports = router;
