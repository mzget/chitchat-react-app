"use strict";
const express = require("express");
const router = express.Router();
const apiUtils = require("../../scripts/utils/apiUtils");
const adminController = require("../../scripts/controllers/admin/adminController");
/* GET home page. */
router.get('/', function (req, res, next) {
    next();
});
router.post("/create", function (req, res, next) {
    req.checkBody("chart", "request for chart object").notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(500).json(new apiUtils.ApiResponse(false, errors));
    }
    let chart = req.body.chart;
    adminController.createOrgChart(chart).then(value => {
        res.status(200).json(new apiUtils.ApiResponse(true, null, value));
    }).catch(err => {
        console.error("create org chart  fail!", err);
        res.status(500).json(new apiUtils.ApiResponse(false, err));
    });
});
module.exports = router;
