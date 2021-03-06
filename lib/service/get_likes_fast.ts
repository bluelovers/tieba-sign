import getMyLikeTieba = require('../api/get_likes_fast');
import event = require('../event');
import encrypt = require('../encrypt');
import bluebird = require('bluebird');

export = bluebird.coroutine<string[], string>(function* (bduss: string)
{
	const postData = {
		'BDUSS': bduss,
		_client_id: '03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36',
		_client_type: '4',
		_client_version: '1.2.1.17',
		_phone_imei: '540b43b59d21b7a4824e1fd31b08e9a6',
		from: 'tieba',
		net_type: '3',
	};

	const resp = yield getMyLikeTieba(encrypt(postData));
	const json = JSON.parse(resp);

	if (json.error_code === '0')
	{
		const all = json.forum_list && json.forum_list.map(function (v)
		{
			return v.name;
		});
		yield event.emitAsync('getlikes:all', all);
		return all;
	}

	return [];
});
