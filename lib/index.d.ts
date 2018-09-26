import Service = require('./api');
import createJar = require('./createJar');
import bluebird = require('bluebird');
export { Service, createJar, };
export declare const service: {
    getlikes: (a1: string) => bluebird<string[]>;
    getlikesFast: (a1: string) => bluebird<string[]>;
    sign: (a1: any) => bluebird<{}>;
    getProfile: (a1: string) => bluebird<{
        username: string;
    }>;
    skipAd: () => bluebird<{}>;
};
