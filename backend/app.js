/**
 * Requires
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/**
 * const
 */
// Content of the public folder will be generated by Webpack with a Vue app
const PUBLIC_FOLDER = path.join(__dirname, 'public')

/**
 * Routes
 *
 * We are only handling the REST API on the backend
 * The rest of the routes is handled client side using Vue
 */
var apiRouter = require('./routes/api');

/**
 * App
 */
var app = express();

/**
 * Express defaults
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(PUBLIC_FOLDER));

/**
 * Listen for API calls...
 */
app.use('/api', apiRouter);

/**
 * Redirect the rest to the Vue app
 * 404 are handled with Vue too
 * index.html needs to be generated by Vue
 */
app.use(function (req, res) {
    res.sendFile(PUBLIC_FOLDER + '/index.html');
});

module.exports = app;