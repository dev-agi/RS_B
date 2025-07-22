const express = require('express');
const app = express();
const badgesRouter = require('./badges');

app.use('/', badgesRouter);

module.exports = app;
