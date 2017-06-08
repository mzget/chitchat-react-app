"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var reapop_1 = require("reapop");
// 1. import theme
var theme = require("reapop-theme-wybo");
// 
var ReapopComponent = (function (_super) {
    __extends(ReapopComponent, _super);
    function ReapopComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReapopComponent.prototype.render = function () {
        // 2. set `theme` prop
        return (React.createElement("div", null,
            React.createElement(reapop_1["default"], { theme: theme })));
    };
    return ReapopComponent;
}(React.Component));
exports.ReapopComponent = ReapopComponent;
