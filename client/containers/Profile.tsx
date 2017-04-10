import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { ProfileDetailEnhancer } from "./profile/ProfileDetailEnhancer";

import * as userRx from "../redux/user/userRx";

interface IComponentNameState {
    alert: boolean;
};
class Profile extends React.Component<IComponentProps, IComponentNameState> {
    alertTitle = "";
    alertMessage = "";

    clientWidth = document.documentElement.clientWidth;
    clientHeight = document.documentElement.clientHeight;
    headerHeight = null;
    subHeaderHeight = null;
    bodyHeight = null;

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

    onAlert(error: string) {
        this.alertTitle = "Alert!";
        this.alertMessage = error;
        this.setState(previous => ({ ...previous, alert: true }));
    }

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState, alert: false }), () => {
            // @Here clear error message in reducer.
            this.props.dispatch(userRx.emptyState());
        });
    }

    render() {
        return (
            <div>
                <div id={"toolbar"} style={{ height: this.headerHeight, overflowY: "hidden" }} >
                    <SimpleToolbar title={"Profile"} onBackPressed={this.onBackPressed} />
                </div>
                <div id={"app_body"} style={{ backgroundColor: Colors.indigo50, height: this.bodyHeight, overflowY: "auto" }}>
                    <ProfileDetailEnhancer
                        user={this.props.userReducer.user}
                        teamProfile={this.props.userReducer.teamProfile}
                        alert={this.onAlert} />
                </div>
                <DialogBox
                    title={this.alertTitle}
                    message={this.alertMessage}
                    open={this.state.alert}
                    handleClose={this.closeAlert} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Profile);