"use strict";
const express = require("express");
const mongodb = require("mongodb");
const mkdirp = require("mkdirp");
const uuid = require('uuid');
const multer = require("multer");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const config_1 = require("../../config");
const webConfig = config_1.getConfig();
const upload = multer({ dest: config_1.Paths.fileUpload }).single('file');
router.post('/', function (req, res, next) {
    let path = config_1.Paths.fileUpload;
    mkdirp.sync(path);
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.dir(err);
            return res.status(500).json({ success: false, message: "fail to upload" + err });
        }
        console.dir(req.file);
        if (!!req.file) {
            res.status(200).json({ success: true, result: req.file.path.replace('public', '') });
        }
        else {
            res.status(500).json({ success: false, message: "fail file is missing: " });
        }
    });
});
module.exports = router;
