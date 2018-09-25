import event = require( '../event' );
import store = require( '../store/records' );

export = function () {
	event.on( 'sign:success', function ( data ) {
		return store.save( 'signed', data.name );
	} );
	event.on( 'sign:already-signed', function ( data ) {
		return store.save( 'signed', data.name );
	} );
	event.on( 'sign:failed', function ( data ) {
		// do nothing
	} );
	event.on( 'sign:not-support', function ( data ) {
		// do nothing
	} );
}
