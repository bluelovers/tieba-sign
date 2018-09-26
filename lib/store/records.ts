import getCache from '../cache';
import bluebird = require('bluebird');
import { getDate } from '../helpers';
import fs = require('fs-extra');
import { console } from '../console';

let CACHE_DB_KEY = 'records';

export interface IRecords
{
	[k: string]: IRecordsDay
}

export interface IRecordsDay
{
	signed?: string[],
}

export function getkey(type: string)
{
	let date = getDate();
	let key = date + '.' + type;

	return key;
}

export async function save(type: string, record: any[])
{
	let date = getDate();

	return getCache().readJSONIfExists<IRecords>(CACHE_DB_KEY)
		.then(function (data)
		{
			let json: IRecords = data && data.json || {};

			json[date] = json[date] || {};
			json[date][type] = json[date][type] || [];

			json[date][type].push(record);

			return getCache().writeJSON(CACHE_DB_KEY, {
				[date]: json[date],
			});
		})
		;
}

export function load(type: string)
{
	let date = getDate();

	return getCache().readJSONIfExists<IRecords>(CACHE_DB_KEY)
		.then(function (data)
		{
			if (data && data.json[date] && data.json[date][type])
			{
				return data.json[date][type]
			}

			return [];
		})
}

export function clear()
{
	return getCache().clearKey(CACHE_DB_KEY).then(ls => console.log(ls))
}

export function close()
{
	return getCache().clearKey(CACHE_DB_KEY, true)
}
