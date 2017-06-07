"use strict";
var React = require("react");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var actions = function (props) { return [
    <FlatButton_1.default label="OK" primary={true} onMouseUp={props.handleClose}/>,
]; };
exports.DialogBox = function (props) {
    return (<MuiThemeProvider_1.default>
            <div>
                <Dialog_1.default title={props.title} actions={actions(props)} modal={true} open={props.open} onRequestClose={props.handleClose}>
                    {props.message}
                </Dialog_1.default>
            </div>
        </MuiThemeProvider_1.default>);
};
