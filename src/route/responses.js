'use strict';

module.exports = {
    exists: function(res) {
        res.status = 409;
        res.send({ status: "error", error: "Object already exists" });
    },
    notExists: function(res) {
        res.status = 404;
        res.send({ status: "error", error: "Object does not exist" });
    },
    ok: function(res, status) {
        if (status == null) {
            status = 200;
        }
        res.status(status);
        res.send({ status: "OK" });
    },
    error: function(res, message, status) {
        if (status == null) {
            status = 500;
        }
        res.status(status);
        res.send({ status: "error", error: message });
    }
};