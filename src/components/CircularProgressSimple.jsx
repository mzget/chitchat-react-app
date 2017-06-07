"use strict";
var React = require("react");
var CircularProgress_1 = require("material-ui/CircularProgress");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var reflexbox_1 = require("reflexbox");
var CircularProgressSimple = function (props) { return (<MuiThemeProvider_1.default>
        <div {...props}>
            <CircularProgress_1.default thickness={7}/>
        </div>
    </MuiThemeProvider_1.default>); };
exports.__esModule = true;
exports["default"] = reflexbox_1.withReflex()(CircularProgressSimple);
