"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var reflexbox_1 = require("reflexbox");
var material_ui_1 = require("material-ui");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var FontIcon_1 = require("material-ui/FontIcon");
var IconButton_1 = require("material-ui/IconButton");
var Colors = require("material-ui/styles/colors");
var FileReaderInput = require("react-file-reader-input");
var styles = {
    span: {
        paddingRight: 2
    }
};
var FileReaderBox = function (props) { return (React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: props.fileReaderChange, disabled: props.disabled },
    React.createElement(IconButton_1["default"], { disabled: props.disabled },
        React.createElement(FontIcon_1["default"], { className: "material-icons" }, "attachment")))); };
var SendButton = function (props) { return (React.createElement(IconButton_1["default"], { onClick: props.onSubmit, disabled: props.disabled },
    React.createElement(FontIcon_1["default"], { className: "material-icons" }, "send"))); };
var StickerButton = function (props) { return (React.createElement(IconButton_1["default"], { onClick: props.onSticker, disabled: props.disabled },
    React.createElement(FontIcon_1["default"], { className: "material-icons" }, "insert_emoticon"))); };
var PlaceButton = function (props) { return (React.createElement(IconButton_1["default"], { onClick: props.onLocation, disabled: props.disabled },
    React.createElement(FontIcon_1["default"], { className: "material-icons" }, "place"))); };
exports.TypingBox = function (props) {
    return (React.createElement(MuiThemeProvider_1["default"], null,
        React.createElement("div", { id: "typing_box", style: { margin: 2, backgroundColor: Colors.darkWhite } },
            React.createElement(reflexbox_1.Flex, null,
                React.createElement(PlaceButton, __assign({}, props)),
                React.createElement(StickerButton, __assign({}, props)),
                React.createElement(FileReaderBox, __assign({}, props)),
                React.createElement(material_ui_1.TextField, { disabled: props.disabled, hintText: (props.disabled) ? "Chat room disabled!" : "Type your message", value: props.value, onChange: props.onValueChange, onKeyDown: function (e) {
                        if (e.key === "Enter")
                            props.onSubmit();
                    }, fullWidth: true }),
                React.createElement(SendButton, __assign({}, props))))));
};
