/**
 * Created by user on 2018/9/22/022.
 */

import { Cacache, ICacacheOptions } from 'lazy-cacache';
import PackageJson =  require('../package.json');

let cache: Cacache;
export let options: ICacacheOptions = {};

export function getCache(opts: ICacacheOptions = {})
{
	return new Cacache({
		name: PackageJson.name,
		autoCreateDir: true,
		...options,
		...opts,
	})
}

export default getCache
