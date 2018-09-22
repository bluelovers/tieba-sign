import API = require( '../api' );

export = API.create( {
	method: 'post',
	url: 'http://tieba.baidu.com/c/f/forum/like',
	raw: true,
} );
