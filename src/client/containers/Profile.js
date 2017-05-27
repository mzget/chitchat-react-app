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
import * as Colors from "material-ui/styles/colors";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";
class Profile extends React.Component {
    constructor() {
        super(...arguments);
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;
        this.headerHeight = null;
        this.subHeaderHeight = null;
        this.bodyHeight = null;
    }
    componentWillMount() {
        this.state = {
            alert: false
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.bodyHeight = this.clientHeight - this.headerHeight;
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.history.goBack();
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight, overflowY: "hidden" } },
                React.createElement(SimpleToolbar, { title: "Profile", onBackPressed: this.onBackPressed })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, overflowX: "hidden", margin: 0, padding: 0, height: this.bodyHeight } },
                React.createElement(ProfileDetailEnhanced, { user: this.props.userReducer.user, teamProfile: this.props.userReducer.teamProfile, alert: this.props.onError }))));
    }
}
const mapStateToProps = (state) => (__assign({}, state));
export const ProfilePage = connect(mapStateToProps)(Profile);
