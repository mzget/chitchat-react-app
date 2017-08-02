import * as React from "react";
import { connect } from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { ProfileDetailEnhanced } from "./profile/ProfileDetailEnhancer";

import * as userRx from "../redux/user/userRx";

interface IComponentNameState {
    alert: boolean;
}
class Profile extends React.Component<IComponentProps, IComponentNameState> {
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
        this.bodyHeight = this.clientHeight - this.headerHeight;
    }

    onBackPressed() {
        // Jump to main menu.
        this.props.history.goBack();
    }

    render() {
        return (
            <div>
                <div id={"toolbar"} style={{ height: this.headerHeight, overflowY: "hidden" }} >
                    <SimpleToolbar title={"Profile"} onBackPressed={this.onBackPressed} />
                </div>
                <div id={"app_body"} style={{ backgroundColor: Colors.indigo50, overflowX: "hidden", margin: 0, padding: 0, height: this.bodyHeight }}>
                    <ProfileDetailEnhanced
                        user={this.props.userReducer.user}
                        teamProfile={this.props.userReducer.teamProfile}
                        alert={this.props.onError} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export const ProfilePage = connect(mapStateToProps)(Profile) as React.ComponentClass<any>;