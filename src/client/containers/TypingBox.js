"use strict";
const React = require("react");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const FileReaderBox_1 = require("../components/FileReaderBox");
const styles = {
    span: {
        padding: 10
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};
exports.SendButton = (props) => (React.createElement(material_ui_1.RaisedButton, { label: "Send", primary: true, onTouchEnd: props.onSubmit, onMouseUp: props.onSubmit }));
exports.TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider_1.default, null,
        React.createElement("div", null,
            React.createElement(FileReaderBox_1.FileReaderBox, null),
            React.createElement(material_ui_1.TextField, { hintText: "Type your message", value: props.value, onChange: props.onValueChange, onKeyPress: (e) => {
                    if (e.key === 'Enter')
                        props.onSubmit();
                } }),
            React.createElement("span", { style: styles.span }),
            React.createElement(exports.SendButton, { onSubmit: props.onSubmit }))));
};
