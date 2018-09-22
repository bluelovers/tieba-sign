#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const updateNotifier = require("update-notifier");
const yargs = require("yargs");
const pkg = require("../package.json");
const sign = require("../lib");
const cookieStore = require("./store/cookie");
const recordsStore = require("./store/records");
const bluebird = require("bluebird");
updateNotifier({ pkg: pkg }).notify();
class MyError extends Error {
}
const argv = yargs
    .usage(`tieba-sign cookie [bduss]`)
    .command('cookie [bduss]', 'store BDUSS cookie locally', function (argv) {
    return argv;
}, function (argv) {
    const bduss = argv.bduss;
    if (!bduss) {
        console.dir(argv);
        yargs.showHelp();
        process.exit(1);
    }
    return cookieStore.save({
        bduss: bduss,
    }).then(v => console.log('saved'));
})
    .command('clear', 'clear stored data', function (yargs) {
    bluebird.all([
        cookieStore.clear(),
        recordsStore.clear(),
    ]).thenReturn(console.log('cleared'));
    return yargs;
})
    .command('$0', 'clear stored data', function (yargs) {
    return yargs.option('skipCache', {
        alias: ['s', 'skip'],
        type: 'boolean',
    });
}, function (argv) {
    main({
        skipCache: !!argv.skipCache,
    });
})
    .argv;
const handlers = {
    cookie: function (argv) {
        const bduss = argv._[1];
        return cookieStore.save({
            bduss: bduss,
        }).then(v => console.log('saved'));
    },
    clear: function () {
        return bluebird.all([
            cookieStore.clear(),
            recordsStore.clear(),
        ]).thenReturn(console.log('cleared'));
    },
};
function main(options) {
    require('./cache')();
    options = options || {};
    const skipCache = options.skipCache;
    const Service = sign.Service;
    const service = sign.service;
    const createJar = sign.createJar;
    bluebird.coroutine(function* () {
        const cookie = yield cookieStore.load();
        const bduss = cookie.bduss;
        if (!bduss) {
            throw new MyError(`請先執行 ${argv.$0} cookie`);
        }
        console.log(bduss);
        // setup Service
        Service.jar(createJar([
            [
                'BDUSS=' + bduss,
                'http://tieba.baidu.com',
            ],
            [
                'novel_client_guide=1',
                'http://tieba.baidu.com',
            ],
        ]));
        yield service.skipAd();
        const profile = yield service.getProfile(bduss);
        const username = profile.username;
        if (username) {
            console.log('開始用戶 ' + username + ' 的簽到');
        }
        else {
            console.log('開始簽到');
        }
        const likes = (yield service.getlikesFast(bduss)) || [];
        const signed = skipCache ? [] : yield recordsStore.load('signed');
        const filtered = skipCache ? likes : likes.filter(function (like) {
            return !~signed.indexOf(like);
        });
        console.log('共', likes.length, '個貼吧，已簽到', signed.length, '個\n');
        yield service.sign(filtered);
    })()
        .finally(function () {
        return bluebird.all([
            cookieStore.close(),
            recordsStore.close(),
        ]);
    })
        .catch(function (e) {
        if (e instanceof MyError) {
            console.error(e.message);
        }
        else {
            console.error(e);
        }
        process.exit(1);
    });
}
