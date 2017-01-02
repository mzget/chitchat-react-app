"use strict";
const React = require("react");
const List_1 = require("material-ui/List");
const Avatar_1 = require("material-ui/Avatar");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const ChatDataModels_1 = require("../chats/models/ChatDataModels");
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
            return this.props.value.map((message, i, arr) => {
                switch (message.type) {
                    case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Text]:
                        {
                            return (React.createElement("div", { key: i },
                                React.createElement(CardWithAvatar_1.default, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : '', avatar: (message.user.avatar) ?
                                        React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), cardText: message.body })));
                        }
                    case ChatDataModels_1.ContentType[ChatDataModels_1.ContentType.Image]:
                        {
                            return (React.createElement("div", { key: i },
                                React.createElement(CardWithAvatar_1.default, { title: message.user.username, subtitle: (message.createTime) ? message.createTime.toString() : '', avatar: (message.user.avatar) ?
                                        React.createElement(Avatar_1.default, { src: message.user.avatar }) : React.createElement(Avatar_1.default, null, message.user.username.charAt(0)), cardText: message.body })));
                        }
                    default:
                        break;
                }
            });
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
