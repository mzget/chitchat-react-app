import * as React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";

import { IComponentProps } from "../utils/IComponentProps";

import { DialogBox } from "../components/DialogBox";
import { SnackbarSimple } from "../components/SnackbarSimple";

import * as StalkBridgeActions from "../redux/stalkBridge/stalkBridgeActions";
import * as StalkNotificationActions from "../redux/stalkBridge/StalkNotificationActions";

import * as AlertMsg from "../consts/AlertMsg";

interface IComponentNameState {
    openSnackbar: boolean;
    snackbarMessage: string;
    snackbarClose: (reason: string) => void;
};

class SnackbarBox extends React.Component<IComponentProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            openSnackbar: false,
            snackbarMessage: "",
            snackbarClose: null
        };

        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { stalkReducer } = nextProps;

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
                <SnackbarSimple
                    open={this.state.openSnackbar}
                    message={this.state.snackbarMessage}
                    handleRequestClose={this.closeSnackbar}
                    hideDuration={2000} />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
function mapStateToProps(state) { return { ...state }; }
export const SnackbarToolBox = connect(mapStateToProps)(SnackbarBox);
