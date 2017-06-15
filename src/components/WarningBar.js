"use strict";
var React = require("react");
var flexbox_react_1 = require("flexbox-react");
var Colors = require("material-ui/styles/colors");
exports.WarningBar = function () { return (React.createElement("div", { id: "warning_bar" },
    React.createElement(flexbox_react_1["default"], { style: { backgroundColor: Colors.red500 }, flexGrow: 1, alignItems: "center", justifyContent: "center" },
        React.createElement(flexbox_react_1["default"], { flexDirection: "column" },
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Unable to connect whit chat service."),
            React.createElement("span", { style: { color: Colors.white, fontSize: 14 } }, "Check your Internet connection."))))); };
