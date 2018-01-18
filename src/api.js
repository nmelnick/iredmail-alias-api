'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const compression = require('compression');
const conf        = require('../config');
const sequelize   = require('./models/sequelize').sequelize;

sequelize.authenticate().then(function() {
    const app = express();
    app.use(morgan('combined'));
    app.use(bodyParser.json());
    if (conf.http.compression) {
        app.use(compression());
    }

    const aliases = require('./route/aliases');
    const forwardings = require('./route/forwardings');
    const up = require('./route/up');
    app.use('/api/v1/aliases', aliases);
    app.use('/api/v1/forwardings', forwardings);
    app.use('/up', up);
    
    app.listen(conf.http.port, () => {
        console.log('Listening on ' + conf.http.port);
    });
});
