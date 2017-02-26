"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongodb = require("mongodb");
const fs = require("fs");
const uuid = require("uuid");
const multer = require("multer");
const MongoClient = mongodb.MongoClient;
const router = express.Router();
const apiUtils = require("../../scripts/utils/apiUtils");
const config_1 = require("../../config");
const upload = multer({ dest: config_1.Paths.fileUpload }).single("file");
const FileType = require("../../scripts/FileType");
router.post("/", function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.error(err);
            return res.status(500).json({ success: false, message: "fail to upload" + err });
        }
        console.log("file", req.file);
        if (!!req.file) {
            let file = req.file;
            let fullname = "";
            if (file.mimetype.match(FileType.imageType))
                fullname = file.path + file.mimetype.replace("image/", ".");
            else if (file.mimetype.match(FileType.videoType))
                fullname = file.path + file.mimetype.replace("video/", ".");
            else if (file.mimetype.match(FileType.textType))
                fullname = file.path + file.mimetype.replace("text/", ".");
            fs.readFile(file.path, function (err, data) {
                if (err) {
                    res.status(500).json(new apiUtils.ApiResponse(false, err));
                }
                else {
                    fs.writeFile(fullname, data, function (err) {
                        if (err) {
                            return res.status(500).json(new apiUtils.ApiResponse(false, err));
                        }
                        fs.unlink(file.path, (err) => {
                            if (err)
                                throw err;
                            console.log("successfully deleted req.file");
                        });
                        file.path = fullname.replace("public", "");
                        res.status(200).json(new apiUtils.ApiResponse(true, null, file));
                    });
                }
            });
        }
        else {
            res.status(500).json({ success: false, message: "fail file is missing: " });
        }
    });
});
module.exports = router;
