"use strict";
const React = require("react");
const CircularProgress_1 = require("material-ui/CircularProgress");
const CircularProgressSimple = () => (React.createElement("div", null,
    React.createElement(CircularProgress_1.default, null),
    React.createElement(CircularProgress_1.default, { size: 60, thickness: 7 }),
    React.createElement(CircularProgress_1.default, { size: 80, thickness: 5 })));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CircularProgressSimple;
