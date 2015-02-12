# jquery cookieIntegration

A simple jQuery plugin that helps you integrate cookies into web pages.

## WARNING

This readme needs to be updated.

## Dependencies

This plugin requires the following jQuery plugin to work!

[jquery-cookie](https://github.com/carhartl/jquery-cookie/blob/master/README.md)

Please install this plugin first. (It handles the behind the scenes creation and updating of cookies.)

## Installation

Include script *after* the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/jquery.cookie-integration.js"></script>
```

**Do not include the script directly from GitHub (http://raw.github.com/...).**  GitHub is not a CDN.

## Basic Usage

Your basic use case with cookie-integration is like this. You have a some UI elements that you want to change based upon what a cookie is set to. This plugin enables you to do the following:
1. Set up `<a>` tags to set or update a cookie when they're clicked.
2. Update the classes on a div container so you can work some CSS changes on it's children.

*NOTE: This plugin should work with multiple cookies, but hasn't been tested yet.*

Example HTML:

```HTML
<div class="cookie"></div>
<a class="cookie-control" data-cookie="color" data-cookie-value="blue">blue</a>
<a class="cookie-control" data-cookie="color" data-cookie-value="yellow">yellow</a>
```

Example CSS:

```CSS
.cookie {
	width: 100px;
	height: 100px;
}
.cookie.value-red    { background-color: red; }
.cookie.value-blue   { background-color: blue; }
.cookie.value-yellow { background-color: yellow; }
```

Example Javascript:

```javascript
jQuery(document).ready(function($) {
	$(".cookie").cookieIntegration({
		cookie:        'color',
		defaultValue:  'red',
		cookieValues:  ['blue', 'yellow'],
	});
});
```

When you first load the page, the square should display as red. Then if you click the links, the square's color will change. Reload the page to see that the changes stick.

If the plugin isn't working properly, check the console for errors.

## Configuration

### cookie

You must set a name for the cookie or the plugin will refuse to run.

ex.
```
cookie: user-language,
```

### cookieValues

As a precautionary measure, you must define all the cookie values you'll be using. **You cannot set any cookie value that is not predefined here.**

Again, it's not necessary to put the default value in this list.

ex.
```
cookieValues: ['ENG', 'JAP', 'KOR'],
```

### defaultValue

You do not have to set a default value. If you do not, updateClass() will add a 'value-not-set' class to your element(s).

Also, the default value does not have to be in the list of cookie values.

ex.
```
defaultValue: 'ENG',
```

### controlSelector

**DEFAULT:**
```
controlSelector: 'a.cookie-control',
```

The jQuery selector that will identify elements, such as `<a>` tags, that will update a cookie value when clicked.

ex.
```
controlSelector: '.language-option',
```

### controlCookieAttr

**DEFAULT:**
```
controlCookieAttr: 'data-cookie,
```

The name of the cookie control element attribute that identifies its corresponding cookie.

ex.
```
controlCookieAttr: 'data-cookie-name',
```

### controlCookieValueAttr

**DEFAULT:**
```
controlCookieValueAttr: 'data-cookie-value',
```

The name of the cookie control element attribute that identifies its corresponding cookie.

ex.
```
controlCookieValueAttr: 'data-cookie-value',
```

### cookieDuration

**DEFAULT:**
```
cookieDuration: '30',
```

(From the jquery.cookie docs)

"Define lifetime of the cookie. Value can be a `Number` which will be interpreted as days from time of creation or a `Date` object. If omitted, the cookie becomes a session cookie."

ex.
```
cookieDuration: '14',
```

### cookiePath

(From the jquery.cookie docs)

"Define the path where the cookie is valid. *By default the path of the cookie is the path of the page where the cookie was created (standard browser behavior).* If you want to make it available for instance across the entire domain use `path: '/'`. Default: path of page where the cookie was created."

ex.
```
cookiePath: '/part-of-the-site-where-language-setting-matters/',
```

**DEFAULT:**
```
cookiePath: '/',
```