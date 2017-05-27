import * as React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { chitchatFactory } from "./chitchat";
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./redux/configureStore";
import { HomePageWithDialogBox } from "./containers/HomeEnhanced";
import { ChatPageEnhanced } from "./containers/ChatPageEnhanced";
import { ChatRoomSettingsEnhanced } from "./containers/ChatRoomSettingsPage";
import { TeamPageEnhanced } from "./containers/TeamPageEnhanced";
import { ProfilePageEnhanced } from "./containers/ProfilePageEnhanced";
import { MainPageWithDialogBox } from "./containers/Main";
import { M_MainPageEnhanced } from "./containers/m_Main";
import { AdminPageEnhanced } from "./containers/AdminPageEnhanced";
import { SMALL_TABLET } from "./chitchat/consts/Breakpoints";
chitchatFactory.initStore(Store);
Store.subscribe(() => {
    chitchatFactory.setAuthStore(Store.getState().userReducer.user, Store.getState().authReducer.token);
    chitchatFactory.setTeamStore({
        team: Store.getState().teamReducer.team,
        members: Store.getState().teamReducer.members
    });
});
class App extends React.Component {
    constructor() {
        super(...arguments);
        this.clientWidth = document.documentElement.clientWidth;
    }
    render() {
        return (React.createElement(Provider, { store: Store },
            React.createElement(Router, null,
                React.createElement("div", null,
                    React.createElement(Route, { exact: true, path: "/", component: HomePageWithDialogBox }),
                    React.createElement(Route, { path: "/team/:filter", component: TeamPageEnhanced }),
                    React.createElement(Route, { path: "/profile/:filter/:user", component: (this.clientWidth < SMALL_TABLET) ? ProfilePageEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/chatslist/:filter", component: (this.clientWidth < SMALL_TABLET) ? M_MainPageEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/chatroom/chat/:room_id", component: (this.clientWidth < SMALL_TABLET) ? ChatPageEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/chatroom/settings/:room_id/:edit", component: (this.clientWidth < SMALL_TABLET) ? ChatRoomSettingsEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/admin/:filter", component: AdminPageEnhanced })))));
    }
}
export default App;
