"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reflexbox_1 = require("reflexbox");
const Colors = require("material-ui/styles/colors");
exports.WarningBar = () => (React.createElement("div", { id: "warning_bar" },
    React.createElement(reflexbox_1.Flex, { style: { backgroundColor: Colors.red500 }, align: "center", justify: "center", flexColumn: true },
        React.createElement(reflexbox_1.Flex, { flexColumn: true },
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Unable to connect whit chat service."),
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Check your Internet connection.")))));
