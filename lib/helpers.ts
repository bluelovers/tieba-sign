import iconv = require( 'iconv-lite' );

export function GBK2UTF8(content)
{
	return iconv.decode(Buffer.from(content, 'binary'), 'gbk').toString();
}

export function delay(timeout)
{
	return new Promise(function (resolve, reject)
	{
		setTimeout(function ()
		{
			resolve();
		}, timeout || 0);
	});
}

function repeat(char, count)
{
	char = char + '';
	return new Array(count + 1).join(char);
}

function padZero(str, count)
{
	str = str + '';
	if (str.length < count)
	{
		str = repeat('0', count - str.length) + str;
	}
	return str;
}

export function getDate()
{
	const t = new Date();
	const y = t.getFullYear() + '';
	const m = padZero(t.getMonth() + 1, 2);
	const d = padZero(t.getDate(), 2);
	return y + '-' + m + '-' + d;
}

