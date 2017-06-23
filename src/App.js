import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
import { chitchatFactory } from "./Chitchat";
/**
 * ### configureStore
 *  ```configureStore``` will connect the ```reducers```,
 */
import Store from "./redux/configureStore";
import { apolloClient } from "./redux/rootReducer";
import { ReapopNotiBoxWithState } from "./components/NotificationSystem";
import { HomePageWithDialogBox } from "./containers/HomeEnhanced";
import { ForgotAccount } from "./containers/ForgottenAccount";
import { ChatPageEnhanced } from "./containers/ChatPageEnhanced";
import { ChatRoomSettingsEnhanced } from "./containers/ChatRoomSettingsPage";
import { TeamPageEnhanced } from "./containers/TeamPageEnhanced";
import { ProfilePageEnhanced } from "./containers/ProfilePageEnhanced";
import { MainPageWithDialogBox } from "./containers/Main";
import { M_MainPageEnhanced } from "./containers/m_Main";
import { AdminPageEnhanced } from "./containers/AdminPageEnhanced";
import { MEDIUM_WINDOW } from "./chitchat/consts/Breakpoints";
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
        return (React.createElement(ApolloProvider, { store: Store, client: apolloClient },
            React.createElement(Router, null,
                React.createElement("div", { id: "app" },
                    React.createElement(ReapopNotiBoxWithState, null),
                    React.createElement(Route, { exact: true, path: "/", component: HomePageWithDialogBox }),
                    React.createElement(Route, { path: "/forgotaccount", component: ForgotAccount }),
                    React.createElement(Route, { path: "/team/:filter", component: TeamPageEnhanced }),
                    React.createElement(Route, { path: "/profile/:filter/:user", component: (this.clientWidth < MEDIUM_WINDOW) ? ProfilePageEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/chatslist/:filter", component: (this.clientWidth < MEDIUM_WINDOW) ? M_MainPageEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/chatroom/chat/:room_id", component: (this.clientWidth < MEDIUM_WINDOW) ? ChatPageEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/chatroom/settings/:room_id/:edit", component: (this.clientWidth < MEDIUM_WINDOW) ? ChatRoomSettingsEnhanced : MainPageWithDialogBox }),
                    React.createElement(Route, { path: "/admin/:filter", component: AdminPageEnhanced })))));
    }
}
export default App;
