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
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const AdminBox_1 = require("./admins/AdminBox");
;
;
class Admin extends React.Component {
    constructor() {
        super(...arguments);
        this.menus = ["create-org-group", "create-projectbase-group", "create-group"];
    }
    componentWillMount() {
    }
    onAdminMenuSelected(key) {
        console.log('onAdminMenuSelected', key);
    }
    render() {
        return (React.createElement("span", null,
            React.createElement(SimpleToolbar_1.default, { title: 'Admin' }),
            React.createElement(AdminBox_1.default, { itemName: this.menus, onSelectItem: this.onAdminMenuSelected })));
    }
}
const mapstateToProps = (state) => {
    return __assign({}, state);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect(mapstateToProps)(Admin);
