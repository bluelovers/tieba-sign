"use strict";
const event = require("../event");
const _ = require("../helpers");
const encrypt = require("../encrypt");
const delay = _.delay;
const bluebird = require("bluebird");
const api = {
    getSignStatus: require('../api/get_sign_status'),
    sign: require('../api/sign'),
};
const getSignStatus = bluebird.coroutine(function* (name) {
    const content = yield api.getSignStatus(name);
    const matched = content.match(/<td[ ]style="text-align:right;".*?<\/td>/);
    if (!matched || matched[0] === '<td style="text-align:right;"></td>') {
        return { status: -1 };
    }
    else if (matched[0].indexOf('已签到') !== -1) {
        return { status: 1 };
    }
    else {
        const fidMatched = matched[0].match(/fid=(\d+)/);
        const tbsMatched = matched[0].match(/tbs=([0-9a-f]{26})/);
        if (!fidMatched || !tbsMatched) {
            return { status: -1 };
        }
        const fid = fidMatched[1];
        const tbs = tbsMatched[1];
        return { status: 0, fid: fid, tbs: tbs };
    }
});
const handlers = {
    doSignOne: bluebird.coroutine(function* (name, data) {
        const postData = {
            '_client_id': '03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36',
            '_client_type': '4',
            '_client_version': '1.2.1.17',
            '_phone_imei': '540b43b59d21b7a4824e1fd31b08e9a6',
            'fid': data.fid,
            'kw': encodeURIComponent(name),
            'net_type': '3',
            'tbs': data.tbs,
        };
        var json = {};
        try {
            const rst = yield api.sign(encrypt(postData));
            json = JSON.parse(rst);
        }
        catch (e) { }
        // 有时error_code === '0', 但没有返回sign_bonus_point，实际上是签到失败了
        if (json.error_code === '0' &&
            (json.user_info && json.user_info.sign_bonus_point)) {
            yield event.emitAsync('sign:success', {
                name: name,
                point: json.user_info.sign_bonus_point,
            });
        }
        else {
            yield event.emitAsync('sign:failed', {
                name: name,
            });
        }
    }),
    notSupport: bluebird.coroutine(function* (name) {
        yield event.emitAsync('sign:not-support', {
            name: name,
        });
    }),
    alreadySigned: bluebird.coroutine(function* (name) {
        yield event.emitAsync('sign:already-signed', {
            name: name,
        });
    }),
};
const signOne = bluebird.coroutine(function* (name) {
    try {
        const rst = yield getSignStatus(name);
        const status = rst.status;
        const statusMaps = {
            '-1': handlers.notSupport,
            '0': handlers.doSignOne,
            '1': handlers.alreadySigned,
        };
        const handler = statusMaps[String(status)];
        if (typeof handler === 'function') {
            yield handler(name, {
                fid: rst.fid,
                tbs: rst.tbs,
            });
        }
        return String(status);
    }
    catch (e) {
        throw e;
    }
});
const signOneAndDelay = bluebird.coroutine(function* (name) {
    const status = yield signOne(name);
    // make a delay only when sign successfully
    if (status === '0') {
        yield delay(650);
    }
});
const signAll = bluebird.coroutine(function* (names) {
    yield event.emitAsync('sign:start');
    names = names || [];
    for (var i = 0, len = names.length; i < len; i++) {
        yield signOneAndDelay(names[i]);
    }
    yield event.emitAsync('sign:end');
});
module.exports = signAll;
