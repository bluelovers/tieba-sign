"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../cache");
let CACHE_DB_KEY = 'cookie';
async function save(cookie) {
    return cache_1.default.writeJSON(CACHE_DB_KEY, cookie, {
        metadata: {
            kkk: 7,
        },
        integrity: null,
    });
}
exports.save = save;
function load() {
    return cache_1.default.readJSONIfExists(CACHE_DB_KEY)
        .then(function (data) {
        return data && data.json || {};
    });
}
exports.load = load;
function clear() {
    return cache_1.default.clearKey(CACHE_DB_KEY);
}
exports.clear = clear;
function close() {
    return cache_1.default.clearKey(CACHE_DB_KEY, true);
}
exports.close = close;
