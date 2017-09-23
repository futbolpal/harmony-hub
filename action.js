'use strict';

if(!process.env.DEPLOY_DOMAIN){
  console.log("Missing environment variable: DEPLOY_DOMAIN (https://myapp.com)");
  process.exit(1);
}

const fs = require('fs');
const actionPackage = {
  "actions": [
    {
      "name": "MAIN",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "actions.intent.MAIN"
      }
    },
    {
      "name": "com.harmony-home.climate-control.temperature.adjust",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.temperature.adjust",
        "parameters": [{
          "name": "temperature",
          "type": "SchemaOrg_Number"
        }],
        "trigger":{
          "queryPatterns" : [
            "turn the temperature up by $SchemaOrg_Number:temperature degrees",
            "turn up the temperature by $SchemaOrg_Number:temperature degrees",
            "turn up the temp by $SchemaOrg_Number:temperature degrees",
            "turn the temp up by $SchemaOrg_Number:temperature degrees",
            "turn the temperature up $SchemaOrg_Number:temperature degrees",
            "turn up the temperature $SchemaOrg_Number:temperature degrees",
            "turn up the temp $SchemaOrg_Number:temperature degrees",
            "turn the temp up $SchemaOrg_Number:temperature degrees",
            "turn the temperature down by $SchemaOrg_Number:temperature degrees",
            "turn down the temperature by $SchemaOrg_Number:temperature degrees",
            "turn down the temp by $SchemaOrg_Number:temperature degrees",
            "turn the temp down by $SchemaOrg_Number:temperature degrees",
            "turn the temperature down $SchemaOrg_Number:temperature degrees",
            "turn down the temperature $SchemaOrg_Number:temperature degrees",
            "turn down the temp $SchemaOrg_Number:temperature degrees",
            "turn the temp down $SchemaOrg_Number:temperature degrees"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.temperature.up",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.temperature.up",
        "trigger":{
          "queryPatterns" : [
            "i'm cold",
            "it's freezing in here",
            "raise the temperature",
            "turn down the AC"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.temperature.down",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.temperature.down",
        "trigger":{
          "queryPatterns" : [
            "i'm hot",
            "it's boiling in here",
            "lower the temperature",
            "turn up the AC"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.temperature.set",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.temperature.set",
        "parameters": [{
          "name": "temperature",
          "type": "SchemaOrg_Number"
        }],
        "trigger":{
          "queryPatterns" : [
            "set the AC to $SchemaOrg_Number:temperature degrees",
            "set the temperature to $SchemaOrg_Number:temperature degrees"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.temperature.reset",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.temperature.reset",
        "parameters": [{
          "name": "temperature",
          "type": "SchemaOrg_Number"
        }],
        "trigger":{
          "queryPatterns" : [
            "the AC is set to $SchemaOrg_Number:temperature degrees",
            "the AC is currently set to $SchemaOrg_Number:temperature degrees",
            "the temperature is set to $SchemaOrg_Number:temperature degrees",
            "the temperature is currently set to $SchemaOrg_Number:temperature degrees"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.temperature.status",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.temperature.status",
        "trigger":{
          "queryPatterns" : [
            "what is the AC currently set to",
            "what is the current temperature"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.on",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.on",
        "trigger":{
          "queryPatterns" : [
            "turn on the AC",
            "turn on AC"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.climate-control.off",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.climate-control.off",
        "trigger":{
          "queryPatterns" : [
            "turn off the AC",
            "turn off AC"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.tv.on",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.tv.on",
        "trigger":{
          "queryPatterns" : [
            "turn on the tv",
            "turn on tv"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.tv.off",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.tv.off",
        "trigger":{
          "queryPatterns" : [
            "turn off the tv",
            "turn off tv"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.tv.mute",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.tv.mute",
        "trigger":{
          "queryPatterns" : [
            "mute the tv",
            "mute tv"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.tv.volume.up",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.tv.volume.up",
        "trigger":{
          "queryPatterns" : [
            "turn the volume up on the tv",
            "turn up the volume on the tv"
          ]
        }
      }
    },
    {
      "name": "com.harmony-home.tv.volume.down",
      "fulfillment": {
        "conversationName": "harmony-home"
      },
      "intent": {
        "name" : "com.harmony-home.intent.tv.volume.down",
        "trigger":{
          "queryPatterns" : [
            "turn the volume down on the tv",
            "turn down the volume on the tv"
          ]
        }
      }
    },
    {
      "name": "actions.devices",
      "deviceControl": {
      },
      "fulfillment": {
        "conversationName": "automation"
      }
    }],
    "conversations": {
      "harmony-home": {
        "name": "harmony-home",
        "url": process.env.DEPLOY_DOMAIN + "/gh"
      },
      "automation" :
      {
        "name": "automation",
        "url": process.env.DEPLOY_DOMAIN + "/ha"
      }
    }
}

const content = JSON.stringify(actionPackage);
fs.writeFile("action.json", content, 'utf8', function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("action.json package generated");
}); 