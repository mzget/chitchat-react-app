"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_redux_1 = require("react-redux");
var WarningBar_1 = require("../../components/WarningBar");
var LinearProgressDialog_1 = require("../../components/LinearProgressDialog");
var StalkBridgeActions = require("../../chitchat/chats/redux/stalkBridge/stalkBridgeActions");
var IStalktProps = (function () {
    function IStalktProps() {
    }
    return IStalktProps;
}());
var StalkComponent = (function (_super) {
    __extends(StalkComponent, _super);
    function StalkComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StalkComponent.prototype.render = function () {
        return (React.createElement("div", null,
            (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT_FAILURE ||
                this.props.stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ?
                React.createElement(WarningBar_1.WarningBar, null) : null,
            (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT) ?
                React.createElement(LinearProgressDialog_1.LinearProgressDialog, { title: "Joining... stalk service", open: true, handleClose: function () { } }) : null));
    };
    return StalkComponent;
}(React.Component));
var mapStateToProps = function (state) { return ({
    stalkReducer: state.stalkReducer,
    userReducer: state.userReducer
}); };
exports.StalkCompEnhancer = react_redux_1.connect(mapStateToProps)(StalkComponent);
