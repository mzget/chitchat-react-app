"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const Colors = require("material-ui/styles/colors");
const SimpleToolbar_1 = require("../components/SimpleToolbar");
const DialogBox_1 = require("../components/DialogBox");
const ProfileDetailEnhancer_1 = require("./profile/ProfileDetailEnhancer");
const userRx = require("../redux/user/userRx");
;
class Profile extends React.Component {
    constructor() {
        super(...arguments);
        this.alertTitle = "";
        this.alertMessage = "";
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
        this.closeAlert = this.closeAlert.bind(this);
        this.onAlert = this.onAlert.bind(this);
        this.headerHeight = document.getElementById("toolbar").clientHeight;
        this.bodyHeight = this.clientHeight - this.headerHeight;
    }
    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }
    onAlert(error) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => (Object.assign({}, previous, { alert: true })));
    }
    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => (Object.assign({}, prevState, { alert: false })), () => {
            // @Here clear error message in reducer.
            this.props.dispatch(userRx.emptyState());
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { id: "toolbar", style: { height: this.headerHeight, overflowY: "hidden" } },
                React.createElement(SimpleToolbar_1.SimpleToolbar, { title: "Profile", onBackPressed: this.onBackPressed })),
            React.createElement("div", { id: "app_body", style: { backgroundColor: Colors.indigo50, height: this.bodyHeight, overflowY: "auto" } },
                React.createElement(ProfileDetailEnhancer_1.ConnectProfileDetailEnhancer, { user: this.props.userReducer.user, teamProfile: this.props.userReducer.teamProfile, alert: this.onAlert })),
            React.createElement(DialogBox_1.DialogBox, { title: this.alertTitle, message: this.alertMessage, open: this.state.alert, handleClose: this.closeAlert })));
    }
}
const mapStateToProps = (state) => (Object.assign({}, state));
exports.default = react_redux_1.connect(mapStateToProps)(Profile);
