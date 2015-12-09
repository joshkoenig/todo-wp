# TodoWP

Inspired by [TodoMVC](http://todomvc.com), a proof-of-concept implementation of the TODO list, using React on the front and WordPress as a storage backend.

![React Screen](https://raw.github.com/joshkoenig/todo-wp/master/react_screen.png)
![WordPress Screen](https://raw.github.com/joshkoenig/todo-wp/master/wp_admin_screen.png)

## Vision

The goal of this project is to help WordPress developers build their JavaScript skills, particularly around the use of the new REST API. Currently the implementation is very simple. All posts on the WordPress site are considered TODO items, and their status of "done" or not is managed by simply adding or removing "(done)" from the title. 

This initial implementation is based on the [React example for ToDoMVC](http://todomvc.com/examples/react/#/), but the vision is to have implementations for other frameworks WordPress is using widely (at a minimum backbone), as well as showcasing how to extend the REST API with custom endpoints.

The near-term focus will be to improve the quality of this example while maintaining excellent tutorial documentation, so that developers can quickly get "up and running" with a working REST API implementation. If other developers would like to contibute other framework examples, or help with examples for backend customization, that's very welcome!

## Requirements

Setting up this example assumes you are running at least PHP 5.5 and are comfortable using command line tools, including [wp-cli](http://wp-cli.org/), `php`, and `curl`.

Required tools:

- [wp-cli](http://wp-cli.org/)
- [npm](https://www.npmjs.com/)
- mysql
- php 5.5 or later

For npm, php and mysql, [homebrew](http://brew.sh/) is an excellent resource if you are on MacOS. 

## Running The Example

The following tutorial should get you up and running in about 10 minutes.

### Download and Install WordPress

(NOTE: This assumes you have a local mysql server running with default local dev settings.)

```bash
echo "create database wp_backend" | mysql -u root
wp core download --path=wp-backend
cd wp-backend
wp core config --dbname=wp_backend --dbuser=root
wp core install --url="localhost:8080" --title="WP MVC TODO" --admin_user="admin" --admin_password="bbqisdelicious" --admin_email="noreply@test.com"
```

You can of course set up the initial WordPress however you like. Just be sure to note your admin credentials for later. 

### Install and Activate the REST API Plugin

Now it's time to install the [REST API plugin](https://wordpress.org/plugins/rest-api/):

```bash
wp plugin install rest-api
wp plugin activate rest-api
```

Easy peasy. Next you'll need to enable permalinks. 

Permalinks are required because the REST API uses URL rewriting to handle incoming requests. The pattern doesn't matter, but if you don't have one nothing will work. Don't forget this step!

```bash
wp option update permalink_structure /index.php/%postname%/
```

### Checkpoint 1 - Curl the API for OPTIONS

So far if you're following this tutorial you haven't had to crack open a browser, and you won't for a bit. To this point we've done it all with `wp-cli`, but if we're going to start running REST API commands, we'll need to have the site accessible over HTTP.

The quickest and easiest way to get a WordPress site running is to use PHP's built in development webserver. It's very easy to start, and much less complex than trying to run a "full stack" local environment.

Open up a new terminal window or tab, navigate to your `wp-backend` directory, and run the following command:

```bash
php -S localhost:8080
```

You'll get output like the following:

```bash
PHP 5.6.14 Development Server started at Sun Dec  6 14:32:00 2015
Listening on http://localhost:8080
Document root is /Users/joshk/pantheon/todoWP/wp-backend
Press Ctrl-C to quit.
```

And if you open a browser and navigate to [http://localhost:8080](http://localhost:8080) you'll see the site, can log in, etc. More importantly you can start poking at the REST API via curl.

Just to be sure it's working, make an `OPTIONS` request:

```bash
curl http://localhost:8080/wp-json/ -X OPTIONS
```
You should get a JSON response like so:

```json
{
  "namespace": "",
  "methods": [
    "GET"
  ],
  "endpoints": [
    {
      "methods": [
        "GET"
      ],
      "args": {
        "context": {
          "required": false,
          "default": "view"
        }
      }
    }
  ],
  "_links": {
    "self": "http://localhost:8080/wp-json/"
  }
}
```

So long as you're getting nice machine readible output, you're on the right path. If you get a screen full of HTML output, you've missed a step somewhere. 

### Install and Activate Basic Auth

For this example we will use the super-simple [Basic Auth](https://github.com/WP-API/Basic-Auth) plugin to allow active use of the API.

```bash
wp plugin install https://github.com/WP-API/Basic-Auth/archive/master.zip
wp plugin activate Basic-Auth-master
```

The Basic Auth plugin is only intended for development, as it requires you to add your credentials to your code. However, it works great to get up and running quickly. 

### Checkpoint 2 - Create a Post via Curl:

At this point we should be able to use our wp-admin login credentials as basic HTTP AUTH headers, and create posts. Doing that via curl looks like this:

```bash
curl http://localhost:8080/wp-json/wp/v2/posts \
  --user admin:bbqisdelicious -X POST \
  -d 'title=Hello API!&content=<p>This was made via the REST API. Neat!</p>&status=publish'
```

Check out the homepage of your site... and give yourself a high-five. You now have a functional WordPress backend. 

### Installing and Running the React Example

To run the React client, start a new terminal window and navigate into the `react` directory within this repository. First install the necessary libraries via npm:

```bash
npm install
```

Next you'll need to edit `js/util.js` to include your WP credentials. Update the second line in that file:

```js
var headers = {'Authorization': 'Basic ' + btoa('USER:PASS')};
```

If you're copy/pasting from this tutorial, the correct update is:

```js
var headers = {'Authorization': 'Basic ' + btoa('admin:bbqisdelicious')};
```

Now launch another standalone webserver for the client. We can use the PHP builtin server again:

```bash
php -S localhost:8000
```

You should now have two terminals running two different PHP webservers. The WordPress backend on `localhost:8080` and the React example on `localhost:8000`.

Finally, open a new browser tab and [load the React app](http://localhost:8000). You should see the two existing posts on your site, and be in a position to add, check off, and even delete via React.

## Status

This is currently a very rough proof-of-concept implementation. There's much to do! 

### TODO (Ironic)

- [ ] Create a WP plugin that defines the TODO post type
  - [ ] Provide a field for the "done" status and an API for checking it.
- [ ] Improve the React code
  - [ ] Use native HTTP data bindings
- [ ] Document using OAuth rather than a hard-coded password

### Contributing

Please do! Pull requests are welcome. Ping @joshkoenig in the WordPress slack if you have questions.
