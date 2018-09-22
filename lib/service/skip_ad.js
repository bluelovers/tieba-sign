"use strict";
const skipAd = require('../api/skip_ad');
const bluebird = require("bluebird");
module.exports = bluebird.coroutine(function* () {
    yield skipAd();
});
