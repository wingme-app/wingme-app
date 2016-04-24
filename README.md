# WingMe App

Wing me is a mobile application for double-dating with your closest friends. Dating made less awkward.

## Developer Documentation

### Tools Used:

* Ionic & Cordova
* AngularJS
* ui-router
* Node
* Express
* Sqlite3
* KnexJS
* SASS (SCSS)

### To Contribute:

* Fork the repo
* Clone your fork locally
* Ensure Ionic and Cordova are installed. If not, install it globally:

```
sudo npm install -g cordova
sudo npm install -g ionic
```

[more on that here](http://ionicframework.com/docs/guide/installation.html)

* Install server & client dependencies

(From the project folder)

```
cd server
npm install
cd ../ionic
npm install
```

* Run both the server and ionic application from their respective folders

```
node server.js
ionic serve
```

* Visit the localhost address that Ionic indicates.

### Front-end

WingMe utilizes AngularJS and Ionic Components to render the front-end. We used the industry-standard ui-router for application routing and built-in Angular factories for state management.

All API calls are made in the corresponding factory file associated for the type of data that it’s maintaining.

### Back-end

WingMe’s custom RESTFul API is built with Node.js and Express, and data management is handled by KnexJS and SQLite.

## WingMe Team

* [Xiaolu Bai](https://github.com/lbai001)
* [Ben Richter](https://github.com/bjr22)
* [Kan Adachi](https://github.com/obber)
* [Jessica Chou](https://github.com/j4chou)
