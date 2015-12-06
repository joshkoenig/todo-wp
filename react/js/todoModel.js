/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
		this.todos = Utils.store(key);
		this.onChanges = [];
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.onChanges.push(onChange);
	};

	app.TodoModel.prototype.inform = function () {
		//Utils.store(this.key, this.todos);
		this.onChanges.forEach(function (cb) { cb(); });
	};

	app.TodoModel.prototype.addTodo = function (title) {
		var payload = 'title='+encodeURIComponent(title)+'&status=publish';
		var result = jQuery.ajax('http://localhost:8080/wp-json/wp/v2/posts',
                       {'headers': headers, 'async': false,
                        'method': 'POST',
                        'data': payload
                       });
		this.todos = this.todos.concat({
			id: result.responseJSON.id,
			title: title,
			completed: false
		});
		console.log(this.todos)
		this.inform();
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
		// Note: it's usually better to use immutable data structures since they're
		// easier to reason about and React works very well with them. That's why
		// we use map() and filter() everywhere instead of mutating the array or
		// todo items themselves.
		this.todos = this.todos.map(function (todo) {
			return Utils.extend({}, todo, {completed: checked});
		});

		this.inform();
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		var url = 'http://localhost:8080/wp-json/wp/v2/posts/' + todoToToggle.id;
		if (todoToToggle.completed) {
			var new_title = todoToToggle.title;
		}
		else {
			var new_title = todoToToggle.title + ' (done)';
		}
		var payload = 'title='+encodeURIComponent(new_title);
		jQuery.ajax(url, {'headers': headers,
			                'method': 'PUT',
			              	'data': payload});

		this.todos = this.todos.map(function (todo) {
			return todo !== todoToToggle ?
				todo :
				Utils.extend({}, todo, {completed: !todo.completed});
		});

		this.inform();
	};

	app.TodoModel.prototype.destroy = function (todo) {
		this.todos = this.todos.filter(function (candidate) {
			return candidate !== todo;
		});
		var url = 'http://localhost:8080/wp-json/wp/v2/posts/' + todo.id;
		jQuery.ajax(url, {'headers': headers, 'method': 'DELETE'});

		this.inform();
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		console.log(todoToSave);
		console.log(text);
		this.todos = this.todos.map(function (todo) {
			return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
		});

		this.inform();
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos = this.todos.filter(function (todo) {
			return !todo.completed;
		});

		this.inform();
	};

})();
