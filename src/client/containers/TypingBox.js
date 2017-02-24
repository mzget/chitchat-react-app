"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const FileReaderInput = require("react-file-reader-input");
const FontIcon_1 = require("material-ui/FontIcon");
const IconButton_1 = require("material-ui/IconButton");
const styles = {
    span: {
        paddingRight: 2
    }
};
const FileReaderBox = (props) => (React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: props.fileReaderChange },
    React.createElement(IconButton_1.default, null,
        React.createElement(FontIcon_1.default, { className: "material-icons" }, "attachment"))));
const SendButton = (props) => (React.createElement(IconButton_1.default, { onClick: props.onSubmit },
    React.createElement(FontIcon_1.default, { className: "material-icons" }, "send")));
const StickerButton = (props) => (React.createElement(IconButton_1.default, { onClick: props.onSticker },
    React.createElement(FontIcon_1.default, { className: "material-icons" }, "insert_emoticon")));
exports.TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", { style: props.styles },
            React.createElement(reflexbox_1.Flex, null,
                React.createElement(StickerButton, Object.assign({}, props)),
                React.createElement(FileReaderBox, Object.assign({}, props)),
                React.createElement(material_ui_1.TextField, { hintText: "Type your message", value: props.value, onChange: props.onValueChange, onKeyDown: (e) => {
                        if (e.key === "Enter")
                            props.onSubmit();
                    } }),
                React.createElement(SendButton, Object.assign({}, props))))));
};
