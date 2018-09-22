import request = require( 'request' );

var wrappedRequest = request;
var defaultUserAgent;

class API
{
	method: string;
	url: string;
	headers;
	paramKeys: any[];
	encoding;
	raw: boolean;

	constructor(config)
	{
		this.method = config.method || 'get';
		this.url = config.url || '';
		this.headers = config.headers || {};
		this.paramKeys = config.params || [];
		this.encoding = config.encoding;
		this.raw = !!config.raw;
	}

	fetch()
	{
		var params = {};

		if (this.raw)
		{
			params = arguments[0] || {};
		}
		else
		{
			const args = [].slice.call(arguments);
			const keys = this.paramKeys;
			params = {};
			Object.keys(keys).forEach(function (i)
			{
				const key = keys[i];
				params[key] = args[i];
			});
		}

		// override headers
		var headers = this.headers;
		if (defaultUserAgent)
		{
			headers = Object.assign({}, {
				'User-Agent': defaultUserAgent,
			}, this.headers);
		}

		const commonOptions = {
			headers: headers,
		}

		var options = {};
		if (this.method.toLowerCase() === 'post')
		{
			options = Object.assign(
				{},
				commonOptions,
				{
					url: this.url,
					method: 'POST',
					form: params,
				},
			);
		}
		else
		{
			options = Object.assign(
				{},
				commonOptions,
				{
					method: 'GET',
					url: this.url,
					qs: params,
				},
			);
		}

		if (this.encoding)
		{
			Object.assign(options, {
				encoding: this.encoding,
			});
		}

		return new Promise(function (resolve, reject)
		{
			wrappedRequest(options, function (err, response, body)
			{
				if (err)
				{
					return reject(err);
				}

				resolve(body);
			});
		});
	}

	static jar(cookieJar)
	{
		wrappedRequest = request.defaults({
			jar: cookieJar,
			// proxy: 'http://127.0.0.1:8888'
		});
	};

	static userAgent(userAgent)
	{
		defaultUserAgent = userAgent;
	};

	static create(config)
	{
		const instance = new this(config);
		return function ()
		{
			return instance.fetch.apply(instance, [].slice.call(arguments))
		};
	}
}

export = API;
