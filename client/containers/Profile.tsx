import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";
import { ConnectProfileDetailEnhancer } from "./profile/ProfileDetailEnhancer";

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
    }

    componentDidMount() {
        this.headerHeight = document.getElementById("toolbar").clientHeight;
        this.bodyHeight = this.clientHeight - this.headerHeight;
    }

    onBackPressed() {
        // Jump to main menu.
        this.props.router.goBack();
    }

    closeAlert() {
        this.alertTitle = "";
        this.alertMessage = "";
        this.setState(prevState => ({ ...prevState, alert: false }), () => {
            // @Here clear error message in reducer.
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <div id={"toolbar"} style={{ height: this.headerHeight }} >
                        <SimpleToolbar title={"Profile"} onBackPressed={this.onBackPressed} />
                        <Subheader>{null}</Subheader>
                    </div>
                    <div id={"app_body"} style={{ backgroundColor: Colors.indigo50, height: this.bodyHeight }}>
                        <ConnectProfileDetailEnhancer user={this.props.userReducer.user} teamProfile={this.props.userReducer.teamProfile} />
                        <DialogBox
                            title={this.alertTitle}
                            message={this.alertMessage}
                            open={this.state.alert}
                            handleClose={this.closeAlert} />
                    </div>
                </div>
            </MuiThemeProvider >
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Profile);