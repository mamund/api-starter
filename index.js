/*****************************************
 * starter service for BigCo, Inc.
 * 2019-01 mamund
 *****************************************/
 
var express = require('express');
var app = express();
var cors = require('cors');

var resources = require('./resources');
var port = process.env.PORT || 8888;

app.use(cors());
app.options('*',cors()); 
app.use('/',resources);

app.listen(port, () => console.log(`listening on port ${port}!`));
