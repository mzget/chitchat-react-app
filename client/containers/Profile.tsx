import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as Colors from "material-ui/styles/colors";
import Subheader from "material-ui/Subheader";

import { IComponentProps } from "../utils/IComponentProps";
import { SimpleToolbar } from "../components/SimpleToolbar";
import { DialogBox } from "../components/DialogBox";

interface IComponentNameState {
    alert: boolean;
};
class Profile extends React.Component<IComponentProps, IComponentNameState> {
    alertTitle = "";
    alertMessage = "";


    componentWillMount() {
        this.state = {
            alert: false
        };

        this.onBackPressed = this.onBackPressed.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
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
                    <div style={{ backgroundColor: Colors.indigo50 }}>

                        <div id={"app_body"} style={{ height: this.bodyHeight, backgroundColor: Colors.indigo50 }}>
                            <Flex flexColumn={true} >
                                <Flex align="center">
                                    <Box p={2} flexAuto></Box>
                                    <Box p={2} flexAuto></Box>
                                </Flex>
                                <Box flexAuto justify="flex-end"></Box>
                                <DialogBox
                                    title={this.alertTitle}
                                    message={this.alertMessage}
                                    open={this.state.alert}
                                    handleClose={this.closeAlert} />
                            </Flex>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider >
        );
    }
}

const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Profile);