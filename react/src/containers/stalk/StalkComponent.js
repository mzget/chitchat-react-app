"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const WarningBar_1 = require("../../components/WarningBar");
const LinearProgressDialog_1 = require("../../components/LinearProgressDialog");
const StalkBridgeActions = require("../../chats/redux/stalkBridge/stalkBridgeActions");
class IStalktProps {
}
class StalkComponent extends React.Component {
    render() {
        return (React.createElement("div", null,
            (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT_FAILURE ||
                this.props.stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ?
                React.createElement(WarningBar_1.WarningBar, null) : null,
            (this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT) ?
                React.createElement(LinearProgressDialog_1.LinearProgressDialog, { title: "Joining... stalk service", open: true, handleClose: () => { } }) : null));
    }
}
const mapStateToProps = (state) => ({
    stalkReducer: state.stalkReducer,
    userReducer: state.userReducer
});
exports.StalkCompEnhancer = react_redux_1.connect(mapStateToProps)(StalkComponent);
