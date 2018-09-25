"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./log')();
const Service = require("./api");
exports.Service = Service;
const createJar = require("./createJar");
exports.createJar = createJar;
const getlikes = require("./service/get_likes");
const getlikesFast = require("./service/get_likes_fast");
const sign = require("./service/sign");
const getProfile = require("./service/get_profile");
const skipAd = require("./service/skip_ad");
exports.service = {
    getlikes,
    getlikesFast,
    sign,
    getProfile,
    skipAd,
};
