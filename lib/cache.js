"use strict";
/**
 * Created by user on 2018/9/22/022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lazy_cacache_1 = require("lazy-cacache");
const PackageJson = require("../package.json");
let cache;
exports.options = {};
function getCache(opts = {}) {
    return new lazy_cacache_1.Cacache(Object.assign({ name: PackageJson.name, autoCreateDir: true }, exports.options, opts));
}
exports.getCache = getCache;
exports.default = getCache;
