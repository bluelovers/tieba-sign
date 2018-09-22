import API = require( '../api' );

export = API.create( {
	method: 'GET',
	url: 'http://tieba.baidu.com/mo/m',
	headers: {
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
		'User-Agent' : 'Mozilla/5.0 (SymbianOS/9.3; Series60/3.2 NokiaE72-1/021.021; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/525 (KHTML, like Gecko) Version/3.0 BrowserNG/7.1.16352'
	},
	encoding: 'utf-8',
	params: [ 'kw' ]
} );
