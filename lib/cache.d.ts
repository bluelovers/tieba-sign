/**
 * Created by user on 2018/9/22/022.
 */
import { ICacacheOptions } from 'lazy-cacache';
export declare let options: ICacacheOptions;
export declare function getCache(opts?: ICacacheOptions): import("lazy-cacache").Cacache;
export default getCache;
