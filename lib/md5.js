"use strict";
const crypto = require("crypto");
module.exports = function md5(input) {
    const hash = crypto.createHash('md5');
    return hash.update(input).digest('hex');
};
