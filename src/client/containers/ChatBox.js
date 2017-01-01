"use strict";
const React = require("react");
const reflexbox_1 = require("reflexbox");
const List_1 = require("material-ui/List");
const Avatar_1 = require("material-ui/Avatar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ChatDataModels_1 = require("../chats/models/ChatDataModels");
const MessageListItem_1 = require("../components/MessageListItem");
const CardWithAvatar_1 = require("../components/CardWithAvatar");
class MyProps {
}
;
;
class ChatBox extends React.Component {
    constructor() {
        super(...arguments);
        this.renderList = () => {
            let { userReducer } = this.props;
            // this.props.value.map(v => console.dir(v))
            return this.props.value.map((message, i) => (React.createElement("div", { key: i }, (message.type == ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]) ?
                React.createElement(CardWithAvatar_1.default, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : '', avatar: (message.user.avatar) ?
                        React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), cardText: message.body }) :
                React.createElement(reflexbox_1.Flex, { justify: 'flex-end' },
                    React.createElement(MessageListItem_1.OutComingList, { onSelected: this.props.onSelected, message: message })))));
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
