import * as React from "react";
import { ContactBox } from "./chatlist/ContactBox";
import { ChatRoomOverview } from "./ChatRoomOverview";
const getView = (match, onError) => {
    if (match.path.match("/chatroom/")) {
        return React.createElement(ChatRoomOverview, { match: match, onError: onError });
    }
    else {
        return React.createElement(ContactBox, null);
    }
};
export const RightNav = ({ match, onError }) => (React.createElement("div", null, getView(match, onError)));
