//! skyscraper-sdk.js
//! version : 0.1.0
//! author : Punnawut Khowkittipaiboon
//! license : MIT
//! skyscraper.zenyai.net

var SKY = (function() {
	var _BASE_URI = "http://skyscraper.zenyai.net/api"

	var _auth_token = null;
	var _login_data = null;

	var _extend = function() {
		var args = Array.prototype.slice.call(arguments);
		var target = args[0];
		var objects = args.slice(1);
		target = target || {};
		for (var i = 0; i < objects.length; i++) {
			for (var j in objects[i]) {
				target[j] = objects[i][j];
			}
		}
		return target;
	};

	var _buildQuery = function(url, params){
		var q = "";
		for (var k in params) {
			if (params.hasOwnProperty(k)) {
				var v = params[k];
				q += encodeURIComponent(k) + "=";
				q += encodeURIComponent(v) + "&";
			}
		}
		if (q !== ""){
			q = q.slice(0, -1);
			url += "?" + q;
		}
		return url;
	};

	var _ajax = function(request, callback) {
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState === 4) {
				var response = null;
				try {
					response = xmlhttp.responseText ? JSON.parse(xmlhttp.responseText) : '';
				} catch (e) {

				}

				if (xmlhttp.status === 401) {
					_auth_token = null;
				}

				callback(response);
			}
		};
		
		var method = request.method || 'GET';
      	xmlhttp.open(method, _buildQuery(request.url, request.params));

		if (method === 'GET') {
			xmlhttp.send(null);
		} 
		else {
			xmlhttp.send(JSON.stringify(request.postData));
		}
	}

	var me = function() {};
	me.prototype = {
		constructor: SKY
	};

	me.prototype.login = function(username, password, callback) {
		var request = {
			url: _BASE_URI + "/auth",
			params: {user: username, pass: password}
		}

		var tokenCallback = function(response) {
			if (response.auth_token) {
				// Store token and login data
				_auth_token = response.auth_token;
				_login_data = response.data;
			}
			else {
				if (response.error && response.error.message) {
					console.error(response.error.message);
				}
				else {
					console.error("Sky login failed.")
				}
			}

			// Invoke callback
			if (callback)
				callback(response);
		}

		_ajax(request, tokenCallback);
	};

	me.prototype.logout = function() {
		// Clear token and login data
		_auth_token = null;
		_login_data = null;
	};

	me.prototype.isLoggedIn = function() {
		return _auth_token != null;
	};

	me.prototype.currentSession = function() {
		var session = {
			auth_token: _auth_token,
			login_data: _login_data
		};

		return session;
	}

	me.prototype.api = function() {
		// function(uri, method, params, callback)
		var args = Array.prototype.slice.call(arguments);

		var execute = function(options) {
			var request = {
				url: _BASE_URI + options.path,
				method: options.method,
				params: options.params,
			}

			_ajax(request, options.callback)
		}

		// Initialize default options
		var options = {
			path: "",
			method: "GET",
			params: {},
			callback: null
		};

		// Check for valid datatype for path
		if (typeof args[0] !== "string") {
			console.error("Path must be a string.");
			return;
		}

		// Set uri path
		options.path = args[0];

		// Parse options
		switch (typeof args[1]) {
			case "function":
				options.callback = args[1];
				break;

			case "object":
				options.params = args[1];

				if (typeof args[2] === "function") {
					options.callback = args[2];
				}

				break;

			case "string":
				options.method = args[1];

				if (typeof args[2] === "object") {
					options.params = args[2];
					if (typeof args[3] === "function") {
						options.callback = args[3];
					}
				}
				else if (typeof args[2] === "function") {
					options.callback = args[2];
				}
		}

		// Check if authorized
		if (!_auth_token) {
			console.error("Not authorized.");
			return;
		}

		// Append token
		_extend(options.params, {auth_token: _auth_token});
		// Call api
		execute(options)
	};

	return me;

})();