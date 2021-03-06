'use strict';

const NewRelic = require('newrelic');
const RedisClient = require('./redis_client');
const HubState = require('./hub_state');

const Health = {}

Health.register = (server) => {
  server.get('/health', (request, reply) => {
    return reply.json({
      app: "OK",
      newrelic: NewRelic.agent._state != 'errored' ? "OK" : "FAIL",
      redis: RedisClient.client().connected ? "OK" : "FAIL"
    });
  });
}

module.exports = Health;
