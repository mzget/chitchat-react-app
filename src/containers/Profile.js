"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const Colors = require("material-ui/styles/colors");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
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
        this.headerHeight = document.getElementById("toolbar").clientHeight;
        this.bodyHeight = this.clientHeight - this.headerHeight;
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight, overflowY: "hidden" } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Profile", onBackPressed: this.onBackPressed })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, overflowX: "hidden", margin: 0, padding: 0 } },
                React.createElement(ProfileDetailEnhancer_1.ProfileDetailEnhanced, { user: this.props.userReducer.user, teamProfile: this.props.userReducer.teamProfile, alert: this.props.onError }))));
    }
}
const mapStateToProps = (state) => (Object.assign({}, state));
exports.ProfilePage = react_redux_1.connect(mapStateToProps)(Profile);
