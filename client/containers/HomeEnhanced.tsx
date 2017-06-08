import * as React from "react";
import { withRouter } from "react-router-dom";

import { HomeWithState } from "./Home";
import { DialogBoxEnhancer } from "./toolsbox/DialogBoxEnhancer";
import { DialogBox, IDialoxBoxProps } from "../components/DialogBox";
import { ReapopComponent } from "../components/NotificationSystem";

export let HomePageWithDialogBox = DialogBoxEnhancer(({ title, message, open, handleClose, onError, history }: any) => (
    <div>
        <ReapopComponent />
        <HomeWithState onError={onError} history={history} />
        <DialogBox
            title={title}
            message={message}
            open={open}
            handleClose={handleClose} />
    </div>
));

HomePageWithDialogBox = withRouter(HomePageWithDialogBox);

