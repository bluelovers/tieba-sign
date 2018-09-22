"use strict";
/**
 * Created by user on 2018/9/22/022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const lazy_cacache_1 = require("lazy-cacache");
const PackageJson = require("../package.json");
exports.cache = new lazy_cacache_1.Cacache({
    name: PackageJson.name,
    autoCreateDir: true,
});
exports.default = exports.cache;
