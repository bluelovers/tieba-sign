import getCache from '../cache';
import bluebird = require('bluebird');

let CACHE_DB_KEY = 'cookie';

export async function save(cookie: {
	bduss: string
})
{
	return getCache().writeJSON(CACHE_DB_KEY, cookie, {
		metadata: {
			kkk: 7,
		},
		integrity: null,
	});
}

export function load()
{
	return getCache().readJSONIfExists<{
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
	return getCache().clearKey(CACHE_DB_KEY)
}

export function close()
{
	return getCache().clearKey(CACHE_DB_KEY, true)
}
