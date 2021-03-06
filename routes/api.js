let express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    config = require('../config'),
    token_check = require('../middleware/token_check'),
    utils = require('../utils'),
    User = require('../models/user'),
    EntryConnect = require('../models/log_connect'),
    Room = require('../models/room');

// route to show a random message (GET http://localhost:8080/api/)
router.use(utils.unless_route('/authenticate', token_check.token_check));

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function(req, res) {
    User.find({}, function(err, users) {
        res.json(users);
    });
});
// route return all rooms (GET https://localhost:8080/api/rooms)
router.get('/rooms', function(req, res) {
        Room.find({}, function(err, rooms) {
            res.json(rooms);    
        });
    });
router.get('/userentry/:rtc_token', (req, res) => {
    EntryConnect.findOne({
            easyRtcToken: req.params.rtc_token
        }, (err, entry) => {
            if(err) {
                utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type lOG_CONNECT with token- ${req.body.easyRtcToken}. Error message: ${err}.`);
                res.json({
                        success: false,
                        message: 'Fail create token'
                    });
            } else {
                res.json(entry);
            }
        });    
});
// auth function
router.post('/authenticate', function(req, res) {
    // find the user
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            utils.appLogger('fail', 'Fail finding document (user)', `Fail, when app try finding document type USER with username - ${req.body.username}. Error message: ${err}.`);
            res.json({
                    success: false,
                    message: 'Fail create token'
                });
        } else {
            if (!user) {
                res.json({
                        success: false,
                        message: 'Authentication failed. User not found.'
                        });
            } else if (user) {
                // check if password matches
                if (!user.checkPassword(req.body.password)) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                        });
                } else {
                        // if user is found and password is right
                        // create a token
                    let token = jwt.sign({username: user.username}, config.secret, {
                        expiresIn: 60 * 60 * 24});// expires in 24 hours
                        user.update({token :token
                        }).exec();
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
    
            }
        }
    });
});
module.exports = router;
