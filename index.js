"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require('pg')
const client = new Client({
  user: 'priyanshu',
  host: 'aichatbotdb.cck66kbswtbo.ap-south-1.rds.amazonaws.com',
  database: 'aichatbotdb',
  password: 'theai123',
  port: 5432,
})
client.connect();

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  var speech =
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText
      ? "Thanks for reaching out to The AI Enterprise! Your query will be answered shortly." // req.body.queryResult.parameters.echoText
      : "Seems like some problem. Speak again.";
  var temp = {
    "google": {
      "expectUserResponse": true,
      "richResponse": {
        "items": [
          {
            "simpleResponse": {
              "textToSpeech": speech,
            }
          }
        ]
      }
    }
  };
  console.log(speech);
  client.query("Insert into public.queries (questions) values('" + req.body.queryResult.parameters.echoText  + "');", (err, res) => {
    if(err) console.log(err);
    else console.log(res.rows);
    client.end();
  });
  return res.json({
    "payload": temp,
    "data": temp,
    "fulfillmentText": speech,
    "speech": speech,
    "displayText": speech,
    "source": "webhook-echo-sample"
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
