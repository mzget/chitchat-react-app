import express = require('express');
import mongodb = require('mongodb');
import mkdirp = require('mkdirp');
import fs = require('fs');
const uuid = require('uuid');
import multer = require('multer');

const MongoClient = mongodb.MongoClient;
const router = express.Router();
import { getConfig, Paths } from '../../config';
const webConfig = getConfig();
const upload = multer({ dest: Paths.fileUpload }).single('file');

router.post('/', function (req, res, next) {
    let path = Paths.fileUpload;
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
        } else {
            res.status(500).json({ success: false, message: "fail file is missing: " });
        }
    });
});

module.exports = router;