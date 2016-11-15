#!/usr/bin/nodejs
//var debug = require('debug')('my-application');
//Load models
let Room = require('./models/room.js');
// Main server application variables
let app = require('./app'),
    fs = require('fs'),
    http = require('http'),
    UserRtcToken = require('./models/user_rtc_token'),
    https = require('https'),
    privateKey = fs.readFileSync('key.pem', 'utf8'),
    certificate = fs.readFileSync('cert.pem', 'utf8'),
    credentials = {
        key: privateKey,
        cert: certificate
    },
    socketIo = require('socket.io'),
    easyrtc = require('../');
// Create http & https servers
let httpServer = http.createServer(app).listen(3000),
    httpsServer = https.createServer(credentials, app).listen(5000);

// Start socket.io so it attaches itself to Express server
let socketServer = socketIo.listen(httpsServer, {'log level': 1});

easyrtc.setOption("logLevel", "debug");

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", function (socket, easyrtcid, msg, socketCallback, callback) {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, function (err, connectionObj) {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared": false});

        console.log("[" + easyrtcid + "] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", function (connectionObj, roomName, roomParameter, callback) {
    console.log('JOIN ROOM EVENT!');
    connectionObj.getEasyrtcid();
    let token = connectionObj.getEasyrtcid();
    UserRtcToken.findOne({
        $or: [{user: connectionObj.getFieldValueSync("credential").user_id},
            {username: connectionObj.getUsername()}],
        room: connectionObj.getFieldValueSync("credential").room_id
    }, function (err, user_rtc) {
        if (!user_rtc) {
            let user = UserRtcToken({
                rtc_token: token,
                room: connectionObj.getFieldValueSync("credential").room_id,
                username: connectionObj.getUsername(),
                user: connectionObj.getFieldValueSync("credential").user_id,
            });
            user.save();
        }
        else {
            user_rtc.update({rtc_token: token}).exec();
        }
    });
    console.log("[" + connectionObj.getEasyrtcid() + "] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});


easyrtc.events.on("roomLeave", function (connectionObj, roomName, roomParameter, callback) {
    console.log('LEAVE ROOM EVENT!');
    let token = connectionObj.getEasyrtcid();
    UserRtcToken.findOne({
        $or: [{user: connectionObj.getFieldValueSync("credential").user_id},
            {username: connectionObj.getUsername()}],
        room: connectionObj.getFieldValueSync("credential").room_id
    }, function (err, user_rtc) {
        user_rtc.update({rtc_token: null}).exec();
    });
    easyrtc.events.defaultListeners.roomLeave(connectionObj, roomName, roomParameter, callback);
});


// Start EasyRTC server
let easyercServer = easyrtc.listen(
    app,
    socketServer,
    null,
    function (err, rtc) {
        console.log("Initialized EasyRTC server");
        console.log('Creatiing new EasyRTC App...');
        rtc.createApp(
            'easyrtc.videochat',
            {
                'roomAutoCreateEnable': false,
                'roomDefaultEnable': false
            },
            myEasyrtcApp
        );
    }
);

let myEasyrtcApp = function (err, appObj) {
    Room.find({}, function (err, roomsList) {
        if (err) {
            throw err;
        } else {
            roomsList.forEach((item) => {
                appObj.createRoom(item.name, null, function (err, roomObj) {
                });
            });
        }
    });
};


// Listen http & https servers on different ports
httpServer.listen(8080, '77.244.221.70', function () {
    console.log('listening on http://77.244.221.70:3000');
});
httpsServer.listen(8080, '77.244.221.70', function () {
    console.log('listeninf on https://77.244.221.70:5000')
});

//app.set('port', process.env.PORT || 3000);

//var server = app.listen(app.get('port'), function() {
//  debug('Express server listening on port ' + server.address().port);
//});