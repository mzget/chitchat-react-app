"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var Dialog_1 = require("material-ui/Dialog");
var FlatButton_1 = require("material-ui/FlatButton");
var MapBox_1 = require("./MapBox");
var MapDialog = (function (_super) {
    __extends(MapDialog, _super);
    function MapDialog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapDialog.prototype.componentWillMount = function () {
    };
    MapDialog.prototype.handleOpen = function () { };
    MapDialog.prototype.handleClose = function () { };
    MapDialog.prototype.render = function () {
        var actions = [
            React.createElement(FlatButton_1["default"], { label: "Cancel", primary: true, onTouchTap: this.handleClose }),
            React.createElement(FlatButton_1["default"], { label: "Submit", primary: true, disabled: true, onTouchTap: this.handleClose }),
        ];
        return (React.createElement("div", null,
            React.createElement(Dialog_1["default"], { title: "Map Dialog", actions: actions, modal: true, open: this.props.open, contentStyle: {
                    width: 480,
                    height: 600
                } },
                React.createElement(MapBox_1.MapBox, null))));
    };
    return MapDialog;
}(React.Component));
exports.MapDialog = MapDialog;
