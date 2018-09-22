"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconv = require("iconv-lite");
function GBK2UTF8(content) {
    return iconv.decode(Buffer.from(content, 'binary'), 'gbk').toString();
}
exports.GBK2UTF8 = GBK2UTF8;
function delay(timeout) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, timeout || 0);
    });
}
exports.delay = delay;
function repeat(char, count) {
    char = char + '';
    return new Array(count + 1).join(char);
}
function padZero(str, count) {
    str = str + '';
    if (str.length < count) {
        str = repeat('0', count - str.length) + str;
    }
    return str;
}
function getDate() {
    const t = new Date();
    const y = t.getFullYear() + '';
    const m = padZero(t.getMonth() + 1, 2);
    const d = padZero(t.getDate(), 2);
    return y + '-' + m + '-' + d;
}
exports.getDate = getDate;
