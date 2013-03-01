(function( window, document, Modernizr, smokesignals, $, undefined ) {
	'use strict';
	
	// Cross-browser window width
	// https://github.com/ten1seven/jRespond/blob/master/js/jRespond.js
	var winWidth = function() {
		var w = 0;
		// IE
		if (!window.innerWidth) {
			if ( document.documentElement.clientWidth !== 0 ) {
				// strict mode
				w = document.documentElement.clientWidth;
			}
			else {
				// quirks mode
				w = document.body.clientWidth;
			}
		}
		else {
			// w3c
			w = window.innerWidth;
		}
		return w;
	};

	// Save the current width
	var curWidth = winWidth();


	/* Get current viewport label from font-family name on HTML element */
	var getViewport = function() {
		var viewport = '';
		if ( window.getComputedStyle && Modernizr.mq('only all') ) {

			// Get the value of html { font-family } from the element style

			// From https://github.com/JoshBarr/js-media-queries/blob/master/js/onmediaquery.js
			if (document.documentElement.currentStyle) {
				viewport = document.documentElement.currentStyle['fontFamily'];
			}
			if (window.getComputedStyle) {
				viewport = window.getComputedStyle(document.documentElement).getPropertyValue('font-family');
			}
			// Android browsers place a "," after an item in the font family list.
			// Most browsers either single or double quote the string.
			viewport = viewport.replace(/['",]/g, '');
		}
		return viewport;
	};

	// Save current viewport
	var curViewport = getViewport();


	/* Debounce code from underscore.js - http://underscorejs.org/ */
	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	var debounce = function(func, wait, immediate) {
		var timeout, result;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) result = func.apply(context, args);
			return result;
		};
	};



	/* DEV - Update <h1> text with breakpoint label */
	var printViewport = function() {
		$('.mq').text(getViewport() + " - " + winWidth() + 'px');
	};
	printViewport();



	var $window = $(window);

	/* Create window resize event using smokesignals.js */
	var windowResize = {};
	smokesignals.convert(windowResize);

	/* Update on window resize */
	$window.bind('resize', debounce(function( evt ) {
		// Make sure width has actually changed, iOS triggers resize on scroll sometimes (http://jsbin.com/igocaf/latest)
		if ( winWidth() !== curWidth ) {
			// Emit resize event
			windowResize.emit('resize');
			
			printViewport();

			// Update width
			curWidth = winWidth();
		}
	}, 200));


	/* Create orientation change event using smokesignals.js */
	var windowRotate = {};
	smokesignals.convert(windowRotate);

	/* Update on orientation change */
	$window.on('orientationchange', debounce(function( evt ) {
		// Emit rotate event
		windowResize.emit('orientationchange');
	}, 200));

})( this, this.document, this.Modernizr, this.smokesignals, jQuery );
