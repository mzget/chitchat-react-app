/**
 * Copyright 2016 Ahoo Studio.co.th.
 *
 * Author @ nattapon.r@live.com
 */
"use strict";
const express = require("express");
const mongodb = require("mongodb");
const uuid = require('uuid');
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
const apiUtils_1 = require("../scripts/utils/apiUtils");
const config = config_1.getConfig();
const MongoClient = mongodb.MongoClient;
const router = express.Router();
router.post('/', function (req, res, next) {
    req.checkBody("email", "Request for email as body parameter.").isEmail();
    req.checkBody("password", "Request for password as body parameter").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.status(500).json({ success: false, message: errors });
        return;
    }
    let email = req.body.email.toLowerCase();
    let pass = req.body.password;
    MongoClient.connect(config.chatDB).then(db => {
        let userColl = db.collection(config_1.DbClient.systemUsersColl);
        userColl.find({ email: email }).project({ email: 1, password: 1 }).limit(1).toArray().then(docs => {
            if (docs.length > 0) {
                let user = docs[0];
                if (user.password == pass) {
                    // if user is found and password is right
                    // create a token
                    jwt.sign(user, config.token.secret, {
                        expiresIn: config.token.expire // expires in 24 hours
                    }, (err, encoded) => {
                        db.close();
                        if (err) {
                            res.status(apiUtils_1.ApiStatus.Error).json({
                                success: false,
                                message: "Fail to sige token " + err,
                                token: ""
                            });
                        }
                        else {
                            // return the information including token as JSON
                            res.status(apiUtils_1.ApiStatus.Success).json({
                                success: true,
                                result: encoded
                            });
                        }
                    });
                }
                else {
                    db.close();
                    res.status(apiUtils_1.ApiStatus.Error).json({ success: false, message: "Authentication failed. Wrong password." });
                }
            }
            else {
                db.close();
                res.status(apiUtils_1.ApiStatus.Error).json({ success: false, message: 'Authentication failed. User not found.' });
            }
        }).catch(err => {
            db.close();
            res.status(apiUtils_1.ApiStatus.Error).json({ success: false, message: `User not found. ${err}` });
        });
    }).catch(err => {
        console.error("Cannot connect db: ", err);
        res.status(apiUtils_1.ApiStatus.Error).json(new apiUtils_1.ApiResponse(false, err));
    });
});
router.post('/verify', (req, res, next) => {
    req.checkBody("token", "Request for token as body param").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.status(500).json({ success: false, message: errors });
        return;
    }
    let useragent = req.useragent;
    let token = req.body.token;
    // verifies secret and checks exp
    jwt.verify(token, config.session.secret, function (err, decoded) {
        if (err) {
            res.status(500).json({ success: false, message: 'Failed to authenticate token.' });
        }
        else {
            let user_id = decoded._id;
            let session = new Log.SessionLog();
            session.action = Log.LogActions[Log.LogActions.LOGIN_LOG];
            session.useragent = useragent.source;
            session.user_id = user_id;
            session.browser = useragent.browser;
            session.geoIp = req.headers[Constant.X_GEOIP];
            session.os = useragent.os;
            session.platform = useragent.platform;
            session.version = useragent.version;
            session.datetime = new Date();
            session.deviceInfo = req.headers[Constant.X_DEVICE_INFO];
            LogController.keepSessionLog(session);
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            res.status(200).json({ success: true, decoded: decoded });
        }
    });
});
router.post('/logout', (req, res, next) => {
    let useragent = req.useragent;
    let token = req.decoded;
    let user_id = token._id;
    if (!user_id) {
        return res.status(500).json({ success: false, message: 'no have user_id...' });
    }
    let session = new Log.SessionLog();
    session.action = Log.LogActions[Log.LogActions.LOGOUT_LOG];
    session.useragent = useragent.source;
    session.user_id = user_id;
    session.browser = useragent.browser;
    session.geoIp = req.headers[Constant.X_GEOIP];
    session.os = useragent.os;
    session.platform = useragent.platform;
    session.version = useragent.version;
    session.datetime = new Date();
    session.deviceInfo = req.headers[Constant.X_DEVICE_INFO];
    LogController.keepSessionLog(session);
});
module.exports = router;