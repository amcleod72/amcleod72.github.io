define( function( require ) {

    'use strict';

	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );
    var Slider = require( 'roundslider.min' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1;
	var tokens;
	var endpoints;

    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var size;

        if (payload) {
            toJbPayload = payload;
            console.log('payload',payload);

			//merge the array of objects.
			var aArgs = toJbPayload['arguments'].execute.inArguments;
			var oArgs = {};
			for (var i=0; i<aArgs.length; i++) {
				for (var key in aArgs[i]) {
					oArgs[key] = aArgs[i][key];
				}
			}
			//oArgs.size will contain a value if this activity has already been configured:
			size = oArgs.size || toJbPayload['configurationArguments'].defaults.size;
        }

		$.get( "/routes/version.json", function( data ) {
			$('#version').html('Version: ' + data.version);
		});

        // If there is no size selected, disable the next button
        if (!size) {
            connection.trigger('updateButton', { button: 'next', enabled: false });
        }

		$('#selectSize').find('option[value='+ size +']').attr('selected', 'selected');
		gotoStep(step);

    });

    connection.on('requestedTokens', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			tokens = data;
            console.log("tokens",data);
		}
    });

    connection.on('requestedEndpoints', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
            console.log("endpoints",endpoints);
		}
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        // Disable the next button if a value isn't selected
        $('#selectSize').change(function() {
            var size = getSize();
            connection.trigger('updateButton', { button: 'next', enabled: Boolean(size) });
        });

        $("#slider").roundSlider({
            radius: 105,
            width: 20,
            handleSize: "+8",
            handleShape: "dot",
            sliderType: "min-range",
            value: 0
        });
    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', text: 'next', enabled: Boolean(getSize()) });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 2:
                $('#step2').show();
                $('#showSize').html(getSize());
                connection.trigger('updateButton', { button: 'back', visible: true });
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                break;
            case 3: // Only 2 steps, so the equivalent of 'done' - send off the payload
                save();
                break;
        }
    };

    function getSize() {
        return $('#selectSize').find('option:selected').attr('value').trim();
    };

    function save() {

        var value = getSize();

		//this will be sent into the custom activity body within the inArguments array.
        toJbPayload['arguments'].execute.inArguments = [{"size": value}];

		toJbPayload.metaData.isConfigured = true;  //this is required by JB to set the activity as Configured.
        connection.trigger('updateActivity', toJbPayload);
    };

});
