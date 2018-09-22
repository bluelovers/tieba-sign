import bluebird = require('bluebird');
export interface IRecords {
    [k: string]: IRecordsDay;
}
export interface IRecordsDay {
    signed?: string[];
}
export declare function getkey(type: string): string;
export declare function save(type: string, record: any[]): Promise<import("lazy-cacache").ICacacheIntegrity<import("lazy-cacache").ICacacheHash<any>>>;
export declare function load(type: string): bluebird<any>;
export declare function clear(): bluebird<void>;
export declare function close(): bluebird<import("lazy-cacache").ICacacheListEntry<any>>;
