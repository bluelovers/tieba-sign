#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const updateNotifier = require("update-notifier");
const yargs = require("yargs");
const pkg = require("../package.json");
const sign = require("../lib");
const cookieStore = require("../lib/store/cookie");
const recordsStore = require("../lib/store/records");
const bluebird = require("bluebird");
const console_1 = require("../lib/console");
const cache_1 = require("../lib/cache");
updateNotifier({ pkg: pkg }).notify();
class MyError extends Error {
}
const argv = yargs
    .usage(`tieba-sign cookie [bduss]`)
    .option('useGlobalCache', {
    alias: ['g'],
    boolean: true,
})
    .option('hideUser', {
    alias: ['h'],
    boolean: true,
})
    // @ts-ignore
    .command('cookie [bduss]', 'store BDUSS cookie locally', function (argv) {
    return argv;
}, function (argv) {
    const bduss = argv.bduss;
    if (!bduss) {
        console_1.console.dir(argv);
        yargs.showHelp();
        process.exit(1);
    }
    handleOptions(argv);
    return cookieStore.save({
        bduss: bduss,
    }).then(v => console_1.console.success('cookies saved'));
})
    .command('clear', 'clear stored data', function (yargs) {
    handleOptions(yargs.argv);
    bluebird.all([
        cookieStore.clear(),
        recordsStore.clear(),
    ]).thenReturn(console_1.console.info('data cleared'));
    return yargs;
})
    // @ts-ignore
    .command('$0', '', function (yargs) {
    return yargs
        .option('skipCache', {
        alias: ['s', 'skip'],
        type: 'boolean',
    })
        .option('cookie', {
        alias: ['c'],
        string: true,
    });
}, function (argv) {
    return main(argv);
})
    .argv;
function handleOptions(argv) {
    if (argv.useGlobalCache) {
        cache_1.options.useGlobalCache = true;
    }
    //console.debug(argv, globalOptions);
    return argv;
}
function main(options) {
    handleOptions(options);
    require('../lib/hook/cache')();
    // @ts-ignore
    options = options || {};
    const skipCache = options.skipCache;
    const Service = sign.Service;
    const service = sign.service;
    const createJar = sign.createJar;
    return bluebird.coroutine(function* () {
        let bduss;
        if (options.cookie) {
            bduss = options.cookie;
        }
        else {
            const cookie = yield cookieStore.load();
            bduss = cookie.bduss;
        }
        if (!bduss) {
            throw new MyError(`請先執行 ${argv.$0} cookie [bduss]`);
        }
        //console.log(bduss);
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
        if (!options.hideUser && username) {
            console_1.console.log('開始用戶 ' + username + ' 的簽到');
        }
        else {
            console_1.console.log('開始簽到');
        }
        const likes = (yield service.getlikesFast(bduss)) || [];
        const signed = skipCache ? [] : yield recordsStore.load('signed');
        const filtered = skipCache ? likes : likes.filter(function (like) {
            return !~signed.indexOf(like);
        });
        console_1.console.log('共', likes.length, '個貼吧，已簽到', signed.length, '個');
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
            console_1.console.error(e.message);
        }
        else {
            console_1.console.error(e);
        }
        process.exit(1);
    });
}
