const co = require( 'co' );
const event = require( '../event' );
const md5 = require( '../md5' );
const _ = require( '../helpers' );
const delay = _.delay;
const api = {
	getSignStatus: require( '../api/get_sign_status' ),
	sign: require( '../api/sign' ),
};

const getSignStatus = co.wrap( function * ( name ) {
	const content = yield api.getSignStatus( name );
	const matched = content.match( /<td[ ]style="text-align:right;".*?<\/td>/ );

	if ( !matched || matched[ 0 ] === '<td style="text-align:right;"></td>' ) {
		return { status: -1 };
	} else if ( matched[ 0 ].indexOf( '已签到' ) !== -1 ) {
		return { status: 1 };
	} else {
		const fidMatched = matched[ 0 ].match( /fid=(\d+)/ );
		const tbsMatched = matched[ 0 ].match( /tbs=([0-9a-f]{26})/ );

		if ( !fidMatched || !tbsMatched ) {
			return { status: -1 };
		}

		const fid = fidMatched[ 1 ];
		const tbs = tbsMatched[ 1 ];
		return { status: 0, fid: fid, tbs: tbs };
	}
} );

function encrypt( data ) {
	const SIGN_KEY = 'tiebaclient!!!';
	var s = '';
	for( var i in data ) {
		s += i + '=' + data[ i ];
	}
	const sign = md5( decodeURIComponent( s ) + SIGN_KEY );
	var result = '';
	for( var i in data ) {
		result += '&' + i + '=' + data[ i ];
	}
	result += '&sign=' + sign;
	return result.replace( '&', '' );
}

const handlers = {
	doSignOne: co.wrap( function * ( name, data ) {
		const postData = {
			'_client_id': '03-00-DA-59-05-00-72-96-06-00-01-00-04-00-4C-43-01-00-34-F4-02-00-BC-25-09-00-4E-36',
			'_client_type': '4',
			'_client_version': '1.2.1.17',
			'_phone_imei': '540b43b59d21b7a4824e1fd31b08e9a6',
			'fid': data.fid,
			'kw': encodeURIComponent( name ),
			'net_type': '3',
			'tbs': data.tbs,
		};

		const rst = yield api.sign( encrypt( postData ) );
		const json = JSON.parse( rst );

		if ( json.error_code === '0' ) {
			event.emit( 'sign:success', {
				name: name,
				point: json.user_info.sign_bonus_point, // 经验值
			} );
		} else {
			event.emit( 'sign:failed', {
				name: name,
			} );
		}
	} ),
	notSupport: co.wrap( function * ( name ) {
		event.emit( 'sign:not-support', {
			name: name,
		} );
	} ),
	alreadySigned: co.wrap( function * ( name ) {
		event.emit( 'sign:already-signed', {
			name: name,
		} );
	} ),
};

const signOne = co.wrap( function * ( name ) {
	try {
		const rst = yield getSignStatus( name );

		const status = rst.status;
		const statusMaps = {
			'-1': handlers.notSupport,
			'0': handlers.doSignOne,
			'1': handlers.alreadySigned,
		}

		const handler = statusMaps[ String( status ) ];

		if ( typeof handler === 'function' ) {
			yield handler( name, {
				fid: rst.fid,
				tbs: rst.tbs,
			} );
		}
	} catch( e ) {
		throw e;
	}
} );

const signOneAndDelay = co.wrap( function * ( name ) {
	yield signOne( name );
	yield delay( 650 );
} );

const signAll = co.wrap( function * ( names ) {
	names = names || [];
	for ( var i = 0, len = names.length; i < len; i++ ) {
		yield signOneAndDelay( names[ i ] );
	}
} );

module.exports = signAll;
