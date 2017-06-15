"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_redux_1 = require("react-redux");
var reapop_1 = require("reapop");
var ReapopNotiBox = (function (_super) {
    __extends(ReapopNotiBox, _super);
    function ReapopNotiBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReapopNotiBox.prototype.componentWillReceiveProps = function (nextProps) {
        var stalkReducer = nextProps.stalkReducer;
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.props.dispatch(reapop_1.addNotification({
                title: 'Alert',
                message: stalkReducer.notiMessage,
                status: 'success',
                dismissible: true,
                dismissAfter: 3000
            }));
        }
    };
    ReapopNotiBox.prototype.render = function () {
        return null;
    };
    return ReapopNotiBox;
}(React.Component));
/**
 * ## Redux boilerplate
 */
var mapStateToProps = function (state) { return ({
    notifications: state.notifications,
    stalkReducer: state.stalkReducer
}); };
exports.ReapopNotiBoxWithState = react_redux_1.connect(mapStateToProps)(ReapopNotiBox);
