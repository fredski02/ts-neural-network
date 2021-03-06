"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const Network_1 = require("./structures/Network");
const Mnist_1 = require("./importers/Mnist");
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.post('/api/readNumber/:networkNumber', (req, res) => {
    var data = req.body.data;
    var networkNumber = req.params.networkNumber;
    var calculatedNetworks = [
        'number-recognition-1x20-hidden',
        'number-recognition-2x16-hidden'
    ];
    var inputArray = JSON.parse(data);
    var data = JSON.parse(fs.readFileSync(__dirname + "/../networks/" + calculatedNetworks[networkNumber] + ".json", "utf-8"));
    var network = new Network_1.NNNetwork();
    network.load(data);
    var output = network.calculate(inputArray);
    var maxValue = 0;
    var maxIndex = 0;
    for (var i = 0; i < output.length; i++) {
        if (output[i] > maxValue) {
            maxValue = output[i];
            maxIndex = i;
        }
    }
    res.send({ number: maxIndex, network: calculatedNetworks[networkNumber] });
});
app.get('/api/mnist/:number', (req, res) => {
    var number = +req.params.number;
    var mnist = new Mnist_1.Mnist();
    mnist.init();
    var length = mnist.structuredData[number].length;
    var randomIndex = Math.floor(Math.random() * length);
    res.send(mnist.structuredData[number][randomIndex]);
});
app.listen(8080, () => {
    console.log("App Listening on port 8080");
});
