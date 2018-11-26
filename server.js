var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var json;

var http = require("https");

var options = {
  "method": "GET",
  "hostname": "tahmoapi.mybluemix.net",
  "port": null,
  "path": "/v1/timeseries/TA00011/rawMeasurements?startDate=2018-06-07&endDate=2018-06-11",
  "headers": {
    "authorization": "Basic NldZSFlUMFhWWTdCWFpIWE43SEJLWUFaODpSazdwWnBkSjBnd3hIVkdyM2twYnBIWDZwOGZrMitwSmhoS0F4Mk5yNzdJ",
    "cache-control": "no-cache",
    "postman-token": "f5be9690-4509-0a30-f656-2d3b984caefa"
  }
};

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./'));

// // viewed at http://localhost:8080
app.get('/api/raw_data', function(req, res) {
    var req = http.request(options, function (response) {
      var chunks = [];
      //res.json(null);

      response.on("data", function (chunk) {
        chunks.push(chunk);
      });

      response.on("end", function () {
        var body = Buffer.concat(chunks);
        json = JSON.parse(body);
        res.json(json);
        console.log(json);
      });
    });
    //req.end();
    //res.sendFile(path.join(__dirname + '/index.html'));
    req.end();
});


app.get("/", function(req, res){
  res.render("index");
})


app.get('/api/fault_data', function(req, response) {
      var options = {
    "method": "GET",
    "hostname": "raw.githubusercontent.com",
    "port": null,
    "path": "/Sakthisa/Sakthisa.github.io/master/TA00011-1.json",
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "5e25a60c-b08b-b980-4bac-faf4265d6576"
    }
    };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      json = JSON.parse(body);
      response.json(json);
      console.log(json);
    });
    });

    req.end();


});

// res.writeHead(200, {'Content-Type': 'application/json'});
// res.end(JSON.stringify(body.toString()));
console.log("Server listening on port 8080");
app.listen(8080)
