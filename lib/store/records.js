"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("../cache");
const helpers_1 = require("../helpers");
const console_1 = require("../console");
let CACHE_DB_KEY = 'records';
function getkey(type) {
    let date = helpers_1.getDate();
    let key = date + '.' + type;
    return key;
}
exports.getkey = getkey;
async function save(type, record) {
    let date = helpers_1.getDate();
    return cache_1.default.readJSONIfExists(CACHE_DB_KEY)
        .then(function (data) {
        let json = data && data.json || {};
        json[date] = json[date] || {};
        json[date][type] = json[date][type] || [];
        json[date][type].push(record);
        return cache_1.default.writeJSON(CACHE_DB_KEY, {
            [date]: json[date],
        });
    });
}
exports.save = save;
function load(type) {
    let date = helpers_1.getDate();
    return cache_1.default.readJSONIfExists(CACHE_DB_KEY)
        .then(function (data) {
        if (data && data.json[date] && data.json[date][type]) {
            return data.json[date][type];
        }
        return [];
    });
}
exports.load = load;
function clear() {
    return cache_1.default.clearKey(CACHE_DB_KEY).then(ls => console_1.console.log(ls));
}
exports.clear = clear;
function close() {
    return cache_1.default.clearKey(CACHE_DB_KEY, true);
}
exports.close = close;
