import bluebird = require('bluebird');
export declare function save(cookie: {
    bduss: string;
}): Promise<import("lazy-cacache").ICacacheIntegrity<import("lazy-cacache").ICacacheHash<any>>>;
export declare function load(): bluebird<{
    bduss: string;
}>;
export declare function clear(): any;
export declare function close(): bluebird<import("lazy-cacache").ICacacheListEntry<any>>;
