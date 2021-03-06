/**
 * Requires
 */
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');

/**
 * Content of the public folder will be generated by Webpack
 */
const PUBLIC_FOLDER = path.join(__dirname, 'public');

/**
 * Routes
 *
 * We are only handling the REST API on the backend
 * The rest of the routes is handled client side using Vue
 */
const apiRouter = require('./routes/api');
const wrapiRouter = require('./routes/wrapi');

/**
 * App
 */
const app = express();

/**
 * Axios handler for timeouts
 * Will trigger the regular error handler
 */
axios.interceptors.response.use(
  config => config,
  (error) => {
    error.code = 408;
    return Promise.reject(error);
  },
);

/**
 * Express defaults
 */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(PUBLIC_FOLDER));

/**
 * Access-Control-Allow-Origin to *
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/**
 * JSON API
 * Includes a custom JSON error handler
 */
app.use('/api', apiRouter);

/**
 * WRAPI
 * Includes a custom plain text error handler
 */
app.use('/wrapi', wrapiRouter);

/**
 * Redirect the rest to the Vue app
 * index.html needs to be generated by Webpack
 */
app.use((req, res) => {
  res.sendFile(`${PUBLIC_FOLDER}/index.html`);
});

/**
 * Default global error handler
 * TODO: Make a custom error handler
 */
app.use((err, req, res, next) => {
  console.error(err.stack); // eslint-disable-line
  res.status(500).send('Something broke!');
});

module.exports = app;
