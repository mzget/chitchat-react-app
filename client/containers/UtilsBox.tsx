import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from 'reflexbox';

import { DialogBox } from "../components/DialogBox";
import { AlertBox } from "../components/AlertBox";
import { SnackbarSimple } from "../components/SnackbarSimple";
import CircularProgressSimple from "../components/CircularProgressSimple";


import * as StalkBridgeActions from '../redux/stalkBridge/stalkBridgeActions';
import * as StalkNotificationActions from '../redux/stalkBridge/StalkNotificationActions';

import * as AlertMsg from "../consts/AlertMsg";

interface IComponentNameProps {
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
};

interface IComponentNameState {
    openDialog: boolean,
    dialogTitle: string,
    dialogMessage: string,

    openSnackbar: boolean,
    snackbarMessage: string,
    snackbarClose: (reason: string) => void
};

class UtilsBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            openDialog: false,
            dialogTitle: "",
            dialogMessage: "",

            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
        };

        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let {  chatroomReducer, chatlogReducer, userReducer, stalkReducer } = nextProps as IComponentNameProps;

        switch (stalkReducer.state) {
            case StalkBridgeActions.STALK_INIT_FAILURE:
                this.setState({
                    ...this.state,
                    openDialog: true,
                    dialogTitle: AlertMsg.stalkInitFail.title,
                    dialogMessage: AlertMsg.stalkInitFail.message
                });
                break;
            default:
                break;
        }

        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.setState(previousState => ({
                ...previousState,
                openSnackbar: true,
                snackbarMessage: stalkReducer.notiMessage,
            }));
        }
    }

    closeSnackbar(reason) {
        this.setState(previousState => ({
            ...previousState,
            openSnackbar: false
        }));
    }

    public render(): JSX.Element {
        return (
            <div>
                <DialogBox handleClose={() => { this.setState({ ...this.state, openDialog: false }) } }
                    open={this.state.openDialog}
                    title={this.state.dialogTitle}
                    message={this.state.dialogMessage}
                    />

                <Flex p={2} align='center'>
                    <Box p={2} flexAuto></Box>
                    <CircularProgressSimple />
                    <Box p={2} flexAuto></Box>
                </Flex>
                <SnackbarSimple open={this.state.openSnackbar} message={this.state.snackbarMessage} handleRequestClose={this.closeSnackbar} hideDuration={2000} />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) {
    return {
        ...state
    };
}
export default connect(mapStateToProps)(UtilsBox);
