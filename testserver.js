var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var webSocketServer = require('websocket').server;

//Tells the app that the map "Public" is static and use that for website stuff.
app.use(express.static(__dirname + '/Public'));

//Websocket variables
const PORT = process.env.PORT || 80;
const gameAddress = "::ffff:127.0.0.1";
var gameSocket = null;

//Variablesfor saving connections and players.
var connectionArray = [];
var playerArray = [];

//At servername/ then show Klient.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/klient.html');
});

//Save a port that server is lisening to
server.listen(PORT, function () {
    console.log('Server is listening on: ' + server.address().address + ':' + PORT);
});

//create websocketserver
var wsServer = new webSocketServer({
    httpServer: server
});

var id = 0;
//when a call for the websocket is made
wsServer.on('request', function (request) {
    console.log(request.remoteAddress);
    //check if the call is made from the gamesocket 
    if (request.remoteAddress === gameAddress) {
        console.log('GAME CONNECTION');
        //save gamesocket
        gameSocket = request.accept(null, request.origin);

        gameSocket.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log(message.utf8Data);
            }
            //TODO- get messege from the game and update score and health
            //read messege.
            //find player in playerList
            // connection.send("HEALTH " + helthValue);
            // connection.send("SCORE " + scoreValue);
        });

        gameSocket.on('close', function (reasonCode, description) {
            console.log('GAME CONNECTION LOST. code: ' + reasonCode + ', desc: ' + description);
            //connection.send("ERROR Game connection lost");
            gameSocket = null;
        });

    }
    //check if the call is from a known mobile or if the list is empty
    else if (connectionArray.map(function (c) { return c.socket.remoteAddress; }).indexOf(request.remoteAddress) === -1 || connectionArray.length === 0) {
        //saving connection
        var connection = request.accept(null, request.origin);
        //connectionArray.push(connection);
        connection.id = id++;
        //Event handler for messege from mobile
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                arg = message.utf8Data.split(' ');

                //if player exist go to gameView
                if (arg[0] === 'CheckPlayer') {
                    if (!(playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress) === -1)) {
                        connection.send('changeBackground ' + playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].id);
                    }
                }
                //Messige to create player
                if (arg[0] === "info") {
                    if (gameSocket) {
                        //check if a player is defiend and if not, create player
                        if (true || playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress) === -1) {
                            playerArray.push({
                                rAddress: connection.socket.remoteAddress,
                                name: arg[1],
                                id: playerArray.length,
                                weapon: arg[2]
                            });
                            //Send info about the new player to the game 
                            //+ playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].id +
                            gameSocket.send('P ' + " " + arg[1] + " " + arg[2]);
                            console.log("Player " + arg[1] + " with id " + playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].id + " Weapon " + arg[2]);
                            //Get the player to gameview
                            connection.send('changeBackground ' + playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].id);
                        }
                        else {
                            //Change info off a player
                            playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].weapon = arg[2];
                            console.log("Player " + arg[1] + " with id " + playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].id + " Weapon " + arg[2] + " uppdate");
                            gameSocket.send('U ' + " " + playerArray[playerArray.map(function (p) { return p.rAddress; }).indexOf(connection.socket.remoteAddress)].id + " " + arg[2]);
                        }
                    }
                    else {
                        connection.send('ERROR Game_not_connected');
                    }
                }
                //when messege is called from client playbutton.
                else if (arg[0] === "message") {
                    //Send controller to gamesocket
                    if (gameSocket) {
                        gameSocket.send("C " + connection.id + " " + arg[1]);
                    }
                    else {
                        connection.send('ERROR Game_not_connected');
                    }
                }
            }
        });
        //when connection closes 
        connection.on('close', function (reasonCode, description) {
            connectionArray.splice(connectionArray.map(function (e) { return e.socket.remoteAddress; }).indexOf(connection.socket.remoteAddress), 1);
            connection == null;
        });
    }
    else {
        connection.send("Error connection_duplicate_denied");
    }
});
