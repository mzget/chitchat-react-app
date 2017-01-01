"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const List_1 = require("material-ui/List");
const Divider_1 = require("material-ui/Divider");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const MessageListItem_1 = require("../components/MessageListItem");
class MyProps {
}
;
;
class ChatBox extends React.Component {
    constructor() {
        super(...arguments);
        this.renderList = () => {
            let { userReducer } = this.props;
            return this.props.value.map((message, i) => (React.createElement("div", { key: i },
                (message.sender != this.props.userReducer.user._id) ?
                    React.createElement(MessageListItem_1.IncomingList, { onSelected: this.props.onSelected, message: message }) :
                    React.createElement(reflexbox_1.Flex, { justify: 'flex-end' },
                        React.createElement(MessageListItem_1.OutComingList, { onSelected: this.props.onSelected, message: message })),
                React.createElement(Divider_1.default, { inset: true }))));
        };
    }
    componentWillMount() {
        this.state = {};
    }
    render() {
        return (React.createElement(MuiThemeProvider_1.default, null,
            React.createElement(List_1.List, null, (!!this.props.value) ? this.renderList() : null)));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatBox;
