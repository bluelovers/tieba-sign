var request = require('request');
var wrappedRequest = request;
var defaultUserAgent;
function API(config) {
    this.method = config.method || 'get';
    this.url = config.url || '';
    this.headers = config.headers || {};
    this.paramKeys = config.params || [];
    this.encoding = config.encoding;
    this.raw = !!config.raw;
}
API.prototype.fetch = function () {
    var params = {};
    if (this.raw) {
        params = arguments[0] || {};
    }
    else {
        var args_1 = [].slice.call(arguments);
        var keys_1 = this.paramKeys;
        params = {};
        Object.keys(keys_1).forEach(function (i) {
            var key = keys_1[i];
            params[key] = args_1[i];
        });
    }
    // override headers
    var headers = this.headers;
    if (defaultUserAgent) {
        headers = Object.assign({}, {
            'User-Agent': defaultUserAgent,
        }, this.headers);
    }
    var commonOptions = {
        headers: headers,
    };
    var options = {};
    if (this.method.toLowerCase() === 'post') {
        options = Object.assign({}, commonOptions, {
            url: this.url,
            method: 'POST',
            form: params,
        });
    }
    else {
        options = Object.assign({}, commonOptions, {
            method: 'GET',
            url: this.url,
            qs: params,
        });
    }
    if (this.encoding) {
        Object.assign(options, {
            encoding: this.encoding,
        });
    }
    return new Promise(function (resolve, reject) {
        wrappedRequest(options, function (err, response, body) {
            if (err) {
                return reject(err);
            }
            resolve(body);
        });
    });
};
API.jar = function (cookieJar) {
    wrappedRequest = request.defaults({
        jar: cookieJar,
    });
};
API.userAgent = function (userAgent) {
    defaultUserAgent = userAgent;
};
API.create = function (config) {
    var instance = new this(config);
    return function () {
        return instance.fetch.apply(instance, [].slice.call(arguments));
    };
};
module.exports = API;
