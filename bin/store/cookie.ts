import cache from '../../lib/cache';
import bluebird = require('bluebird');

let CACHE_DB_KEY = 'cookie';

export async function save(cookie: {
	bduss: string
})
{
	return cache.writeJSON(CACHE_DB_KEY, cookie, {
		metadata: {
			kkk: 7,
		},
		integrity: null,
	});
}

export function load()
{
	return cache.readJSONIfExists<{
			bduss: string
		}>(CACHE_DB_KEY)
		.then(function (data)
		{
			return data && data.json || {} as {
				bduss: string
			};
		})

}

export function clear()
{
	return cache.clearKey(CACHE_DB_KEY)
}

export function close()
{
	return cache.clearKey(CACHE_DB_KEY, true)
}
