/**
 * jQuery cookieIntegration plugin
 *
 * Basic Usage:
 *	(1) Initialize div tags to take classes from specific cookie.
 *	(2) Initialize a tags to set that cookie's value on click.
 *
 * Copyright (c) 2015 Matthew Guy (mattguy.me)
 *
 */

(function($) {

	////////////////////////
	// CHECK DEPENDENCIES //
	////////////////////////

	// jquery.cookie is required for this plugin to work
	if(!$.cookie) 
		throw new Error('Plugin initialization failed: jquery.cookie dependency does not exist.');

	$.fn.cookieIntegration = function(options) {

		/////////////////////
		// CHECK ARGUMENTS //
		/////////////////////

		// cookie must be set
		if (!options.cookie) 
			throw new Error('Plugin initialization failed: cookie option not set.');

		//////////////
		// SETTINGS //
		//////////////

		var settings = $.extend({
					cookie:                  '',
					cookieValues:            [],
					defaultValue:            '',					// optional
					controlSelector:         'a.cookie-control',
					cookieActionAttr:        'data-cookie-action',
					cookieNameAttr:          'data-cookie-name',
					cookieValueAttr:         'data-cookie-value',
					cookieDuration:          30,					// 30 days
					cookiePath:              '/',					// the entire site
				}, options ),
			state = {
					cookieValue:             null,
				},
			that = this;

		//////////////////////
		// COOKIE FUNCTIONS //
		//////////////////////

		function getCookie(name) {
			return $.cookie(name);
		}

		function setCookie(name, value, skipValueCheck) {
			var currName = settings.cookie,
				values = settings.cookieValues,
				duration = settings.cookieDuration,
				path = settings.cookiePath;

			// set the cookie if it's the one we're dealing AND
			// either the value is among the predefine values OR
			//  the skipValueCheck flag is set to true
			if (name === currName) {
				if (skipValueCheck || 
					values.indexOf(value) >= 0) {

					state.cookieValue = value; // no check for same; would block refreshes
					updateClass();
					// create a cookie that lasts for 30 days (default) and is good on the entire site (default)
					return $.cookie(name, value, { expires: duration, path: path });

				} else 
					throw new Error('Set cookie failed: value not within list of values.');
			} else 
				throw new Error('Set cookie failed: name does not match.');

			return;
		}

		function deleteCookie(name) {
			state.cookieValue = null;
			updateClass();
			return $.removeCookie(name, { path: settings.cookiePath });
			// the path setting here must be the same as what the cookie was written with
		}

		function refreshCookie(name) {
			return setCookie(name, getCookie(name), true);
		}

		function resetCookie(name) {
			var defaultValue = settings.defaultValue;
			
			if (defaultValue) {
				return setCookie(name, defaultValue, true);
			} else
				return deleteCookie(name);
		}

		///////////////////////
		// CONTROL FUNCTIONS //
		///////////////////////

		function setHandler(e) {
			// extract cookie name and value
			var name = $(this).attr(settings.cookieNameAttr),
				value = $(this).attr(settings.cookieValueAttr),
				result;

			if (!name) 
				throw new Error('Set cookie failed: cookie name undefined.');
			if (!value)	
				throw new Error('Set cookie failed: cookie value undefined.');

			result = setCookie(name, value);
			if (!result) 
				throw new Error('Set cookie failed: set operation failed.');

			return result;
		}

		function resetHandler(e) {
			// extract cookie name
			var name = $(this).attr(settings.cookieNameAttr),
				result;

			result = resetCookie(name);
			if (!result) 
				throw new Error('Reset cookie failed: reset operation failed.');

			return result;
		}

		function deleteHandler(e) {
			// extract cookie name
			var name = $(this).attr(settings.cookieNameAttr),
				result;

			result = deleteCookie(name);
			if (!result) 
				throw new Error('Delete cookie failed: delete operation failed.');

			return result;
		}

		function updateClass() {
			var value = state.cookieValue,
				defaultValue = settings.defaultValue;

			// remove existing classes
			that.removeClass('default-value');
			that.removeClass(function (index, css) {
				return (css.match (/(^|\s)value-\S+/g) || []).join(' ');
			});

			// add appropriate classes
			if (value) {
				if (value === defaultValue) 
					that.addClass('default-value');
				that.addClass('value-' + value);
			} else {
				that.addClass('value-not-set');
			}
		}

		////////////////////
		// INITIALIZATION //
		////////////////////

		function init() {
			var name = settings.cookie,
				defaultValue = settings.defaultValue,
				selector = settings.controlSelector;

			that.addClass('cookie-' + name);

			// taking a look at the cookie value:
			//	(1) a value already exists OR
			//	(2) there is a default vaule OR
			//	(3) we have no exising or initializing value for the cookie
			if (getCookie(name)) {
				refreshCookie(name);
			} else if (defaultValue) {
				setCookie(name, defaultValue, true);
			} else {
				// manually call updateClass, since we're not hitting setCookie
				updateClass();
			}

			// add click listeners to cookie controllers...
			$(selector).each(function() {
				var ctrlAction = $(this).attr(settings.cookieActionAttr),
					ctrlName = $(this).attr(settings.cookieNameAttr);

				// ...if they have the corresponding cookie name
				if (name === ctrlName) {
					switch (ctrlAction) {
						case 'set':
							$(this).addClass('listening');
							$(this).click(setHandler);
							break;
						case 'reset':
							$(this).addClass('listening');
							$(this).click(resetHandler);
							break;
						case 'delete':
							$(this).addClass('listening');
							$(this).click(deleteHandler);
							break;
						default:
							console.log('Warning: Cookie control initialization failed: cookie action invalid or undefined.');
					}
				} else 
					console.log('Warning: Cookie control initialization failed: cookie name invalid or undefined.');
			});
		}

		//////////
		// MEAT //
		//////////

		init();

		return this;
	 };
 
}(jQuery));