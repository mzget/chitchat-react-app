"use strict";
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
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
const handleChange = (e, results) => {
    results.forEach(result => {
        const [e, file] = result;
        // this.props.dispatch(uploadFile(e.target.result));
        console.log(`Successfully uploaded ${file.name}!`, e);
    });
};
exports.FileReaderBox = (props) => (React.createElement(FileReaderInput, { id: "file-input", onChange: handleChange },
    React.createElement(IconButton_1.default, null,
        React.createElement(FontIcon_1.default, { className: "material-icons" }, "attachment"))));
exports.SendButton = (props) => (React.createElement(IconButton_1.default, { onClick: props.onSubmit },
    React.createElement(FontIcon_1.default, { className: "material-icons" }, "send")));
exports.TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement(reflexbox_1.Flex, null,
            React.createElement(exports.FileReaderBox, null),
            React.createElement("span", { style: styles.span }),
            React.createElement(material_ui_1.TextField, { hintText: "Type your message", value: props.value, onChange: props.onValueChange, onKeyDown: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(exports.SendButton, { onSubmit: props.onSubmit }))));
};
