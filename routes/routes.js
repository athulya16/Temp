const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var userController = require('./controllers/userController');
// For parsing the incoming json.
app.use(bodyParser.json({ limit: '10mb' }));
// To limit the data being parsed from incoming json.
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/user', userController);
module.exports = app;
