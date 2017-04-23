import * as React from "react";

import { ContactBox } from "./chatlist/ContactBox";

const getView = (match) => {
    if (match.path.match("/chatroom/chat")) {
        return null;
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