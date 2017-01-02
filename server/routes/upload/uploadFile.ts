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
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.dir(err);
            return res.status(500).json({ success: false, message: "fail to upload" + err });
        }

        console.dir(req.body)
        console.dir(req.file);

        // Everything went fine
        if (req.body || !!req.file || !!req.files) {
            // req.checkBody("image", "Require image").notEmpty();
            // req.checkBody("extension", "Require extension").notEmpty();

            // let errors = req.validationErrors();
            // if (errors) {
            //     return res.status(500).json({ success: false, message: errors });
            // }

            let image = req.body.image;
            let isVertical = req.body.isVertical;
            let fileSize = req.body.fileSize;
            let extension = req.body.extension;

            let uuname = uuid.v1();
            let filename = uuname + "." + extension;

            let path = Paths.fileUpload;
            let fullname: string = path + filename;
            console.log("filename", fullname);

            mkdirp.sync(path);

            if (!!image) {
                fs.writeFile(fullname, image, { encoding: 'base64' }, function (err) {
                    if (!err) {
                        res.status(200).json({ filename: fullname.replace("./public", "") });
                    }
                    else {
                        res.status(500).json({ success: false, message: err });
                    }
                });
            }
            else if (!!req.file) {
                fs.readFile(req.file.filename, function (err, data) {
                    if (err) {
                        res.status(500).json({ message: err });
                    }
                    else {
                        // var dirname = "/Node/file-upload/uploads/";
                        // var newPath = dirname + req.body.filename;
                        fs.writeFile(fullname, data, function (err) {
                            if (err) {
                                return res.end("Error uploading file.");
                            }
                            res.status(200).json({ filename: fullname.replace("./public", "") });
                            fs.unlink('./public/uploads/' + req.file.filename, (err) => {
                                if (err) throw err;
                                console.log('successfully deleted req.files[0].filename');
                            });
                        });
                    }
                });
            }
            else {
                res.status(500).json({ success: false });
            }
        } else {
            res.status(500).json({ success: false, message: "missing file upload." });
        }
    });
});

module.exports = router;