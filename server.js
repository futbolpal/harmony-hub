'use strict';

const NewRelic = require('newrelic');
const _ = require('underscore');
const s = require("underscore.string");
const Express = require('express');

const Health = require('./health');
const HomeAutomation = require('./home_automation');
const HomeActions = require('./home_actions');
const OAuth = require('./services/oauth');
const BodyParser = require('body-parser')
const server = Express();
server.set('view engine', 'ejs');
server.set('port', +process.env.PORT || 3000);

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({     
  extended: true
})); 

Health.register(server);
HomeAutomation.register(server);
HomeActions.register(server);
OAuth.register(server);

// Start the server
server.listen(server.get('port'));
