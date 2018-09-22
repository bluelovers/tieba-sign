
import skipAd = require( '../api/skip_ad' );
import bluebird = require('bluebird');

export = bluebird.coroutine( function * () {
	yield skipAd();
} );
