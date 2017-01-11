"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const material_ui_1 = require("material-ui");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const SampleLoginBox_1 = require("./SampleLoginBox");
;
;
class SigninBox extends React.Component {
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(reflexbox_1.Flex, { flexColumn: true },
                React.createElement(SampleLoginBox_1.default, null),
                React.createElement(reflexbox_1.Flex, { justify: 'center', align: 'center', p: 2 },
                    React.createElement("p", null, "New to chitchat?"),
                    React.createElement(material_ui_1.RaisedButton, { primary: true, label: "Sign up now!", onClick: null, style: { margin: 8 } }, " ")))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SigninBox;
