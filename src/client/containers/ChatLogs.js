var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from "react";
import { connect } from "react-redux";
import * as StalkBridgeActions from "../redux/stalkBridge/stalkBridgeActions";
import * as ChatLogsActions from "../redux/chatlogs/chatlogsActions";
import ListChatLogs from "./ListChatLogs";
;
;
class ChatLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "", chatsLog: null
        };
        this.convertObjToArr = this.convertObjToArr.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer, stalkReducer } = nextProps;
        switch (stalkReducer.state) {
            case ChatLogsActions.STALK_GET_CHATSLOG_COMPLETE:
                this.convertObjToArr(stalkReducer.chatsLog);
                // - need to get online-status of contact...
                // ChatLogsActions.getContactOnlineStatus();
                break;
            case ChatLogsActions.STALK_UNREAD_MAP_CHANGED:
                this.convertObjToArr(stalkReducer.chatsLog);
                // - need to get online-status of contact...
                // ChatLogsActions.getContactOnlineStatus();
                break;
            case ChatLogsActions.STALK_CHATSLOG_CONTACT_COMPLETE:
                this.convertObjToArr(stalkReducer.chatsLog);
                break;
            default:
                break;
        }
        if (chatroomReducer.state == StalkBridgeActions.STALK_GET_PRIVATE_CHAT_ROOM_ID_SUCCESS) {
        }
    }
    convertObjToArr(obj) {
        if (!obj)
            return;
        let chatsLog = obj;
        let self = this;
        let arr = Object.keys(chatsLog).filter(function (log) {
            if (!!chatsLog[log].roomName && chatsLog[log].roomName.toLowerCase().includes(self.state.search.toLowerCase()))
                return true;
            else
                return false;
        }).map(function (key) {
            return chatsLog[key];
        });
        this.setState(__assign({}, this.state, { chatsLog: arr }), () => console.log("chatsLog convertObjToArr", this.state));
    }
    render() {
        if (!this.state)
            return null;
        return (React.createElement(ListChatLogs, { value: this.state.chatsLog, onSelected: (data) => {
                this.props.router.push(`/chat/${data.id}`);
            } }));
    }
}
/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return __assign({}, state);
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatLogs);
