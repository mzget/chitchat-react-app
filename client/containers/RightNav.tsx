import * as React from "react";

import { ContactBox } from "./chatlist/ContactBox";
import { ChatRoomSettingsPage } from "./ChatRoomSettings";

const getView = (match, onError) => {
    if (match.path.match("/chatroom/")) {
        return <ChatRoomSettingsPage match={match} onError={onError} />
    }
    else {
        return <ContactBox />;
    }
};

export const RightNav = ({ match, onError }) => (
    <div>
        {
            getView(match, onError)
        }
    </div>
);