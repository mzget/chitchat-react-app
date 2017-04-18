"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const FontIcon_1 = require("material-ui/FontIcon");
const IconButton_1 = require("material-ui/IconButton");
const Colors = require("material-ui/styles/colors");
const FileReaderInput = require("react-file-reader-input");
const styles = {
    span: {
        paddingRight: 2
    }
};
const FileReaderBox = (props) => (React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: props.fileReaderChange, disabled: props.disabled },
    React.createElement(IconButton_1.default, { disabled: props.disabled },
        React.createElement(FontIcon_1.default, { className: "material-icons" }, "attachment"))));
const SendButton = (props) => (React.createElement(IconButton_1.default, { onClick: props.onSubmit, disabled: props.disabled },
    React.createElement(FontIcon_1.default, { className: "material-icons" }, "send")));
const StickerButton = (props) => (React.createElement(IconButton_1.default, { onClick: props.onSticker, disabled: props.disabled },
    React.createElement(FontIcon_1.default, { className: "material-icons" }, "insert_emoticon")));
exports.TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", { id: "typing_box", style: { margin: 2, backgroundColor: Colors.darkWhite } },
            React.createElement(reflexbox_1.Flex, null,
                React.createElement(StickerButton, __assign({}, props)),
                React.createElement(FileReaderBox, __assign({}, props)),
                React.createElement(material_ui_1.TextField, { disabled: props.disabled, hintText: (props.disabled) ? "Chat room disabled!" : "Type your message", value: props.value, onChange: props.onValueChange, onKeyDown: (e) => {
                        if (e.key === "Enter")
                            props.onSubmit();
                    }, fullWidth: true }),
                React.createElement(SendButton, __assign({}, props))))));
};
