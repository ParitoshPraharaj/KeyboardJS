/*!
 * KeyboardJS
 * 
 * Copyright 2011, Robert William Hurst
 * Licenced under the BSD License.
 * See https://raw.github.com/RobertWHurst/KeyboardJS/master/license.txt
 */
(function (context, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
	    context.k = context.KeyboardJS = factory();
    }
}(this, function() {
	var locales, locale, activeKeys, comboBindings;

	//polyfills for ms's peice o' shit browsers
	function bind(target, type, handler) { if (target.addEventListener) { target.addEventListener(type, handler, false); } else { target.attachEvent("on" + type, function(event) { return handler.call(target, event); }); } }
	[].indexOf||(Array.prototype.indexOf=function(a,b,c){for(c=this.length,b=(c+~~b)%c;b<c&&(!(b in this)||this[b]!==a);b++);return b^c?b:-1;});

	//locales
	locales = {
		'us': [
			{ "name": "backspace", "keyCode": 8 },
			{ "name": "tab", "keyCode": 9 },
			{ "name": "enter", "keyCode": 13 },
			{ "name": "shift", "keyCode": 16 },
			{ "name": "ctrl", "keyCode": 17 },
			{ "name": "alt", "keyCode": 18 },
			{ "name": ["pause", "break"], "keyCode": 19 },
			{ "name": ["capslock", "caps"], "keyCode": 20 },
			{ "name": ["escape", "esc"], "keyCode": 27 },
			{ "name": ["spacebar", "space"], "keyCode": 32 },
			{ "name": "pageup", "keyCode": 33 },
			{ "name": "pagedown", "keyCode": 34 },
			{ "name": "end", "keyCode": 35 },
			{ "name": "home", "keyCode": 36 },
			{ "name": "left", "keyCode": 37 },
			{ "name": "up", "keyCode": 38 },
			{ "name": "right", "keyCode": 39 },
			{ "name": "down", "keyCode": 40 },
			{ "name": "insert", "keyCode": 45 },
			{ "name": "delete", "keyCode": 46 },
			{ "name": ["0", "zero"], "keyCode": 48 },
			{ "name": ["1", "one"], "keyCode": 49 },
			{ "name": ["2", "two"], "keyCode": 50 },
			{ "name": ["3", "three"], "keyCode": 51 },
			{ "name": ["4", "four"], "keyCode": 52 },
			{ "name": ["5", "five"], "keyCode": 53 },
			{ "name": ["6", "six"], "keyCode": 54 },
			{ "name": ["7", "seven"], "keyCode": 55 },
			{ "name": ["8", "eight"], "keyCode": 56 },
			{ "name": ["9", "nine"], "keyCode": 57 },
			{ "name": "a", "keyCode": 65 },
			{ "name": "b", "keyCode": 66 },
			{ "name": "c", "keyCode": 67 },
			{ "name": "d", "keyCode": 68 },
			{ "name": "e", "keyCode": 69 },
			{ "name": "f", "keyCode": 70 },
			{ "name": "g", "keyCode": 71 },
			{ "name": "h", "keyCode": 72 },
			{ "name": "i", "keyCode": 73 },
			{ "name": "j", "keyCode": 74 },
			{ "name": "k", "keyCode": 75 },
			{ "name": "l", "keyCode": 76 },
			{ "name": "m", "keyCode": 77 },
			{ "name": "n", "keyCode": 78 },
			{ "name": "o", "keyCode": 79 },
			{ "name": "p", "keyCode": 80 },
			{ "name": "q", "keyCode": 81 },
			{ "name": "r", "keyCode": 82 },
			{ "name": "s", "keyCode": 83 },
			{ "name": "t", "keyCode": 84 },
			{ "name": "u", "keyCode": 85 },
			{ "name": "v", "keyCode": 86 },
			{ "name": "w", "keyCode": 87 },
			{ "name": "x", "keyCode": 88 },
			{ "name": "y", "keyCode": 89 },
			{ "name": "z", "keyCode": 90 },
			{ "name": ["meta", "command", "super", "windows", "win"], "keyCode": [91, 92] },
			{ "name": "select", "keyCode": 93 },
			{ "name": "num0", "keyCode": 96 },
			{ "name": "num1", "keyCode": 97 },
			{ "name": "num2", "keyCode": 98 },
			{ "name": "num3", "keyCode": 99 },
			{ "name": "num4", "keyCode": 100 },
			{ "name": "num5", "keyCode": 101 },
			{ "name": "num6", "keyCode": 102 },
			{ "name": "num7", "keyCode": 103 },
			{ "name": "num8", "keyCode": 104 },
			{ "name": "num9", "keyCode": 105 },
			{ "name": "multiply", "keyCode": 106 },
			{ "name": "add", "keyCode": 107 },
			{ "name": "subtract", "keyCode": 109 },
			{ "name": "decimal", "keyCode": 110 },
			{ "name": "divide", "keyCode": 111 },
			{ "name": "f1", "keyCode": 112 },
			{ "name": "f2", "keyCode": 113 },
			{ "name": "f3", "keyCode": 114 },
			{ "name": "f4", "keyCode": 115 },
			{ "name": "f5", "keyCode": 116 },
			{ "name": "f6", "keyCode": 117 },
			{ "name": "f7", "keyCode": 118 },
			{ "name": "f8", "keyCode": 119 },
			{ "name": "f9", "keyCode": 120 },
			{ "name": "f10", "keyCode": 121 },
			{ "name": "f11", "keyCode": 122 },
			{ "name": "f12", "keyCode": 123 },
			{ "name": ["numlock", "num"], "keyCode": 144 },
			{ "name": ["scrolllock", "scroll"], "keyCode": 145 },
			{ "name": ["semicolon", ";"], "keyCode": 186 },
			{ "name": ["equalsign", "equal", "="], "keyCode": 187 },
			{ "name": ["comma", ","], "keyCode": 188 },
			{ "name": ["dash", "-"], "keyCode": 189 },
			{ "name": ["period", "."], "keyCode": 190 },
			{ "name": ["slash", "forwardslash", "/"], "keyCode": 191 },
			{ "name": ["graveaccent", "`"], "keyCode": 192 },
			{ "name": ["openbracket", "["], "keyCode": 219 },
			{ "name": ["closebracket", "]"], "keyCode": 221 },
			{ "name": ["backslash", "\\"], "keyCode": 220 },
			{ "name": ["singlequote", "'"], "keyCode": 222 }
		]

		//If you create a new local please submit it as a pull request or post it in the issue tracker at
		// http://github.com/RobertWhurst/KeyboardJS/issues/
	};

	//keys
	locale = locales['us'];
	comboBindings = [];

	//adds keys to the active keys array
	bind(document, "keydown", function(event) {
		var keys;

		keys = findKeys(event.keyCode);

		console.log('pressed', keys);
	});

	//removes keys from the active array
	bind(document, "keyup", function (event) {
		var keys;

		keys = findKeys(event.keyCode);

		console.log('released', keys);
	});

	//Finds matching keys
	function findKeys(keyCode) {
		var kI, key, cI, matchingKeys;

		console.log(keyCode);

		matchingKeys = [];

		//lookup the key pressed and save it to the active keys array
		for (kI = 0; kI < locale.length; kI += 1) {
			key = locale[kI];

			if(typeof key.keyCode === 'object' && typeof key.keyCode.push === 'function') {
				for(cI = 0; cI < key.keyCode.length; cI += 1) {
					if(key.keyCode[cI] === keyCode) {
						matchingKeys.push(key);
					}
				}
			} else if(typeof key.keyCode === 'number') {
				if(key.keyCode === keyCode) {
					matchingKeys.push(key);
				}
			}
		}

		return matchingKeys;
	}
}));