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
const react_redux_1 = require("react-redux");
const CreateOrgChartForm_1 = require("./CreateOrgChartForm");
;
;
class ManageOrgChartBox extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(CreateOrgChartForm_1.CreateOrgChartForm, __assign({}, this.props))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect()(ManageOrgChartBox);
