requirejs.config({
    paths: {
        vendor: '../vendor',
		postmonger: 'vendor/postmonger',
        roundslider: 'js/roundslider.min.js'
    },
    shim: {
        'vendor/jquery.min': {
            exports: '$'
        },
		'Control': {
			deps: ['vendor/jquery.min', 'vendor/postmonger', 'roundslider.min']
		},
        "roundslider":  ["vendor/jquery.min"]
    }
});

requirejs( ['vendor/jquery.min', 'Control'], function( $, CreateCase ) {
	console.log( 'REQUIRE LOADED' );
});

requirejs.onError = function( err ) {
	console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};
