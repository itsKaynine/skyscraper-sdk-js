SKYScraper SDK For JS
==================

SKYScraper is a proxy for SKY System's private API. It provides a simplified REST API with endpoints similar to SKY, suitable for developing 3rd party applications.

This SDK is a wrapper for [SKYScraper API](http://skyscraper.zenyai.net). It includes all neccessary functions to authenticate and call every endpoints, such as retrieving your user profile or list of courses available.



## Install

##### Install using bower:

```
$ bower install skyscraper-sdk-js
```

##### Manually:

download your own copy from `/dist` folder.


## Usage

I highly encourage you to experiment with the [API Demo](http://skyscraper.zenyai.net/api_demo.php) for an overview of the API.

For those who installed your own copy, replace the url to your file path.

```html
<script src="http://skyscraper.zenyai.net/ajax/skyscraper-sdk-js/master/skyscraper-sdk.min.js"></script>
```

After the script has been imported, you have to create an instance of the wrapper:

```javascript
var sky = new SKY();
```

#### Login to SKY System

```javascript
sky.login('<username>', '<password>', callback);
```

Verify login by using `isLoggedIn`:

```javascript
if (!sky.isLoggedIn()) {
  // perform login
}
```

##### Login Example

```javascript
var user = "u5480958";
var pass = "mypassword";

if (!sky.isLoggedIn()) {
  sky.login(user, pass, function(response) {
    if (response && !response.error) {
      // login success
      console.log(response);
    }
    else {
      // login failed
      console.log("Login error");
    }
  });
}
```

When you successfully login, you will receive an auth token that will uniquely identify your current session. The token is required by SKY to be sent with every requests in order to access API endpoints. This is all handled by the wrapper.

Use `currentSession` to retrieve information about the current session:

```javascript
var session = sky.currentSession();
console.log("Current Session", session);
```


#### Calling API

You can check out the index of available endpoints [here](http://skyscraper.zenyai.net/api).

The function `api` allows you to make calls to the API.

```javascript
sky.api(path, method, params, callback);
```
* Note: method and params is optional with these values as defaults:
-  method: "GET"
-  params: {}



#####  API Example

This is an example for retrieving your contact details:

```javascript
sky.api("/users/my_contact_details", function(response) {
  if (response && !response.error) {
    console.log("My Contact Details", response);
  }
});
```