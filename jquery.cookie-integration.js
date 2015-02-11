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

	$.fn.cookieControl = function(options) {

		/////////////////////
		// CHECK ARGUMENTS //
		/////////////////////

		// cookie and cookieOptions must be set
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
					controlCookieAttr:       'data-cookie',
					controlCookieValueAttr:  'data-cookie-value',
					cookieDuration:          30,					// 30 days
					cookiePath:              '/',					// the entire site
				}, options ),
			state = {
					cookieValue:             '',
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
				values = settings.cookieValues;

			// set the cookie if it's the one we're dealing AND
			// either the value is among the predefine values OR
			//  the skipValueCheck flag is set to true
			if (name === currName) {
				if (skipValueCheck || 
					values.indexOf(value) >= 0) {

					state.cookieValue = value; // no check for same; would block refreshes
					updateClass();
					// create a cookie that lasts for 30 days (default) and is good on the entire site (default)
					return $.cookie(name, value, { expires: cookieDuration, path: cookiePath });

				} else 
					throw new Error('Set cookie failed: value not within list of values.');
			} else 
				throw new Error('Set cookie failed: name does not match.');

			return;
		}

		function deleteCookie(name) {
			return $.removeCookie(name, { path: cookiePath });
			// the path setting here must be the same as what the cookie was written with
		}

		function refreshCookie(name) {
			return setCookie(name, getCookie(name), true);
		}

		///////////////////////
		// CONTROL FUNCTIONS //
		///////////////////////

		function selectCookie(e) {
			// extract cookie name and value
			var name = $(this).attr(settings.controlCookieAttr),
				value = $(this).attr(settings.controlCookieValueAttr),
				result;

			if (!name) 
				throw new Error('Select cookie failed: cookie name not defined.');
			if (!value)	
				throw new Error('Select cookie failed: cookie value not defined.');

			result = setCookie(name, value);
			if (!result) 
				throw new Error('Select cookie failed: set operation failed.');

			return result;
		}

		function updateClass() {
			var value = state.cookieValue,
				defaultValue = settings.defaultValue;

			// remove existing classes
			that.removeClass('default');
			that.removeClass(function (index, css) {
				return (css.match (/(^|\s)value-\S+/g) || []).join(' ');
			});

			// add appropriate classes
			if (value) {
				value === defaultValue && that.addClass('default');
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
				value;

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

			// throw listeners on any cookie controllers
			// TODO: break this out?
			$(settings.controlSelector).each(function() {
				$(this).addClass('listening');
				$(this).click(selectCookie);
			});

		}

		//////////
		// MEAT //
		//////////

		init();

		return this;
	 };
 
}(jQuery));