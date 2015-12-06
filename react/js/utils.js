var app = app || {};
var headers = {'Authorization': 'Basic YWRtaW46ZjAwZjAw'};

(function () {
	'use strict';

	app.Utils = {
		uuid: function () {
			return 'need-id';
		},

		pluralize: function (count, word) {
			return count === 1 ? word : word + 's';
		},

		store: function (namespace, data) {

			if (data) {
				for (var i = data.length - 1; i >= 0; i--) {
					if (data[i].id == 'need-id') {
						var payload = 'title='+encodeURIComponent(data[i].title);
						payload += '&status=publish';
						jQuery.ajax('http://localhost:8080/wp-json/wp/v2/posts',
				                       {'headers': headers, 'async': false,
				                        'method': 'POST',
				                        'data': payload
				                       });
					}
				}
			}
			var todos = []
			var raw = jQuery.ajax('http://localhost:8080/wp-json/wp/v2/posts',
				                       {'headers': headers, 'async': false});
			for (var i = 0; i < raw.responseJSON.length; i++) {
				todos[i] = {'id': raw.responseJSON[i].id, 'title': raw.responseJSON[i].title.rendered, 'completed': false}
				if (todos[i].title.substr(todos[i].title.length - 6) == '(done)') {
					todos[i].completed = true;
				}
			};
			return (todos) || [];
		},

		extend: function () {
			var newObj = {};
			for (var i = 0; i < arguments.length; i++) {
				var obj = arguments[i];
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						newObj[key] = obj[key];
					}
				}
			}
			return newObj;
		}
	};
})();
