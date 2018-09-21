#!/usr/bin/env node
'use strict';
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var updateNotifier = require('update-notifier');
var yargs = require('yargs');
var co = require('co');
var pkg = require('../package.json');
var sign = require('../lib');
var cookieStore = require('./store/cookie');
var recordsStore = require('./store/records');
updateNotifier({ pkg: pkg }).notify();
var argv = yargs
    .alias('s', 'skipCache')
    .command('cookie', 'store cookie locally')
    .command('clear', 'clear stored data')
    .argv;
var handlers = {
    cookie: function (argv) {
        var bduss = argv._[1];
        cookieStore.save({
            bduss: bduss
        });
        console.log('saved');
    },
    clear: function () {
        cookieStore.clear();
        recordsStore.clear();
        console.log('cleared');
    }
};
var commandName = argv._[0];
var handler = handlers[commandName];
// if command matched
if (typeof handler === 'function') {
    handler(argv);
}
else {
    main({
        skipCache: !!argv.skipCache
    });
}
function main(options) {
    require('./cache')();
    options = options || {};
    var skipCache = options.skipCache;
    var Service = sign.Service;
    var service = sign.service;
    var createJar = sign.createJar;
    co(function () {
        var cookie, bduss, profile, username, likes, signed_1, filtered, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cookie = cookieStore.load();
                    bduss = cookie.bduss;
                    // setup Service
                    Service.jar(createJar([
                        [
                            'BDUSS=' + bduss,
                            'http://tieba.baidu.com'
                        ],
                        [
                            'novel_client_guide=1',
                            'http://tieba.baidu.com'
                        ],
                    ]));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, service.skipAd()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, service.getProfile(bduss)];
                case 3:
                    profile = _a.sent();
                    username = profile.username;
                    if (username) {
                        console.log('开始用户 ' + username + ' 的签到');
                    }
                    else {
                        console.log('开始签到');
                    }
                    return [4 /*yield*/, service.getlikesFast(bduss)];
                case 4:
                    likes = (_a.sent()) || [];
                    signed_1 = skipCache ? [] : recordsStore.load('signed');
                    filtered = skipCache ? likes : likes.filter(function (like) {
                        return !~signed_1.indexOf(like);
                    });
                    console.log('共', likes.length, '个贴吧，已签到', signed_1.length, '个\n');
                    return [4 /*yield*/, service.sign(filtered)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    throw e_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
