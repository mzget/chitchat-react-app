"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var React = require("react");
var react_redux_1 = require("react-redux");
var reapop_1 = require("reapop");
// 1. import theme
var theme = require("reapop-theme-wybo");
var reapop_2 = require("reapop");
var ReapopComponent = (function (_super) {
    __extends(ReapopComponent, _super);
    function ReapopComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReapopComponent.prototype.componentWillReceiveProps = function (nextProps) {
        var stalkReducer = nextProps.stalkReducer;
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.props.dispatch(reapop_2.addNotification({
                title: stalkReducer.notiMessage.title,
                message: stalkReducer.notiMessage.body,
                image: stalkReducer.notiMessage.image,
                dismissible: true,
                dismissAfter: 3000
            }));
        }
    };
    ReapopComponent.prototype.render = function () {
        // 2. set `theme` prop
        return (React.createElement("div", null,
            React.createElement(reapop_1["default"], { theme: theme })));
    };
    return ReapopComponent;
}(React.Component));
/**
 * ## Redux boilerplate
 */
var mapStateToProps = function (state) { return ({
    notifications: state.notifications,
    stalkReducer: state.stalkReducer
}); };
exports.ReapopNotiBoxWithState = react_redux_1.connect(mapStateToProps)(ReapopComponent);
