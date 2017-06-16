require.config({
   paths: {
        vendor: '../vendor',
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min',
        postmonger: 'postmonger.min',
        roundslider: 'roundslider.min',
        control: 'Control'
    },

    // Use shim for plugins that does not support ADM
    shim: {
        'postmonger': ['jquery'],
        'roundslider': ['jquery','postmonger'],
        'control': ['jquery','roundslider']
    }
});

requirejs( ['jquery', 'control'], function( $, CreateCase ) {
	console.log( 'REQUIRE LOADED' );
});

requirejs.onError = function( err ) {
	console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};
