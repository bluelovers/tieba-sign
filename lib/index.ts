require( './log' )();

import Service = require( './api' );
import createJar = require( './createJar' );

import getlikes = require( './service/get_likes' );
import getlikesFast = require( './service/get_likes_fast' );
import sign = require( './service/sign' );
import getProfile = require( './service/get_profile' );
import skipAd = require( './service/skip_ad' );
import bluebird = require('bluebird');


export {
	Service,
	createJar,
}

export const service = {
	getlikes,
	getlikesFast,
	sign,
	getProfile,
	skipAd,
};
