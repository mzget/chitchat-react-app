"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var LinearProgressSimple_1 = require("./LinearProgressSimple");
var actions = function (props) { return [
    <FlatButton_1.default label="OK" primary={true} onMouseUp={props.handleClose}/>
]; };
exports.LinearProgressDialog = function (props) {
    return (<MuiThemeProvider_1.default>
            <div>
                <Dialog_1.default title={props.title} actions={actions(props)} modal={true} open={props.open} onRequestClose={props.handleClose}>
                    
                    <reflexbox_1.Flex p={2} align="center">
                        <LinearProgressSimple_1.default />
                    </reflexbox_1.Flex>
                </Dialog_1.default>
            </div>
        </MuiThemeProvider_1.default>);
};
