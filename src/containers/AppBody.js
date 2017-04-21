"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const Chat_1 = require("./Chat");
const Post_1 = require("./Post");
class AppBody extends React.Component {
    render() {
        let { chatroomReducer } = this.props;
        return (React.createElement("div", null, (chatroomReducer.room) ? React.createElement(Chat_1.ChatPage, null) : React.createElement(Post_1.Post, null)));
    }
}
const mapStateToProps = (state) => ({
    chatroomReducer: state.chatroomReducer
});
exports.ConnectedAppBody = react_redux_1.connect(mapStateToProps)(AppBody);
