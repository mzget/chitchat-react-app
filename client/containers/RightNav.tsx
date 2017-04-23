import * as React from "react";

import { ContactBox } from "./chatlist/ContactBox";
import { ChatRoomSettingsPage } from "./ChatRoomSettings";

const getView = (match) => {
    if (match.path.match("/chatroom/chat")) {
        return <ChatRoomSettingsPage match={match} />;
    }
    else {
        return <ContactBox />;
    }
};

export const RightNav = ({ match, onError }) => (
    <div>
        {
            getView(match)
        }
    </div>
);