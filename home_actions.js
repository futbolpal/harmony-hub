'use strict';

const Q = require('q');
const util = require('util');
const NewRelic = require('newrelic');
const RedisClient = require('./redis_client');
const { ActionsSdkApp } = require('actions-on-google');
const HubState = require('./hub_state');
const Intents = require('./intents');
const ClimateControl = require('./handlers/climate_control');
const TvControl = require('./handlers/tv_control');
const WinControl = require('./handlers/win_control');
const User       = require('./models/user');
const OAuth       = require('./services/oauth');


const HomeActions = {}

const askForSignIn = (request, reply) => {
  const app = new ActionsSdkApp({request: request, response: reply});
  return app.askForSignIn();
};

const processCapture = (request, reply) => {
  let intent = request.body.inputs[0];
  console.log('request.body', request.body);
  const fs = require('fs');
  const md5 = require('md5');
  const path = intent.intent.replace(/\./g, '/');
  const contents = JSON.stringify(request.body, null, ' ');
  const hash = md5(intent.raw_inputs[0].query);
  fs.writeFile(`mocks/${path}/sample-${hash}.json`, contents, function(err) {
    return reply.json("OK");
  });
}

const requireConfiguration = (request, response) => {
  const app = new ActionsSdkApp({request, response});
  const redirect_uri = util.format('%s/configuration?accessToken=%s', 
      process.env.DEPLOY_DOMAIN,
      app.getUser().access_token
      );
  console.log('redirect', redirect_uri);
  return app.ask(app.buildRichResponse()
      // Create a basic card and add it to the rich response
      .addSimpleResponse('Please configure your Harmony Home')
      .addBasicCard(app.buildBasicCard('You\'ll need to provide some ' + 
          'additional configuration so we can make your devices respond to you'
          )
        .setTitle('Configuration Required')
        .addButton('Configure Now', redirect_uri)
        )
      );
}

const processGh = (request, reply, hubState, user) => {
  console.log('processGh');
  console.log('intents', request.body.inputs);
  let conversationToken = request.body.conversation.conversationId;
  for(let i = 0; i < request.body.inputs.length; i++){
    let intent = request.body.inputs[0];
    let context = { hubState, intent, user, conversationToken };
    console.log('context', context);
    if(Intents.INTENT_GROUP_CLIMATE_CONTROL.includes(intent.intent)){
      console.log('climate_control');
      return ClimateControl(context, request, reply);
    } else if(Intents.INTENT_GROUP_TV_CONTROL.includes(intent.intent)){
      console.log('tv_control');
      return TvControl(context, request, reply);
    } else if(Intents.INTENT_GROUP_WIN_CONTROL.includes(intent.intent)){
      console.log('win_control');
      return WinControl(context, request, reply);
    }
 
  }
  return reply.json(HomeActionsHelper.createSimpleReply(conversationToken, 'OK'));
}

const handleGh = (request, reply) => {
  console.log('handleGh');
  const withUser = (tokenData) => {
    return User.find(tokenData.uid).then((user) => {
      let ip = user.attributes.hubState.ip;
      return HubState.init(ip).then((hub) => {
        processGh(request, reply, hub, user);
      });
    }, () => { return requireConfiguration(request, reply); });
  }
  const withoutUser = () => {
    return askForSignIn(request, reply);
  }
  let accessToken = request.body.user.accessToken;
  return OAuth.retrieveAuth(accessToken).then(withUser, withoutUser);
};

HomeActions.register = (server) => {
  server.post('/gh', (request, reply) => {
    console.log('POST /gh');
    if(process.env.CAPTURE) { return processCapture(request, reply) }
    handleGh(request, reply);
  });
};
module.exports = HomeActions;
