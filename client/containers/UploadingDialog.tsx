import * as React from 'react';
import { connect } from "react-redux";
import { Flex, Box } from 'reflexbox';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { IComponentProps } from "../utils/IComponentProps";

import * as ChatroomRx from '../redux/chatroom/chatroomRxEpic';

import SimpleCardImage from '../components/SimpleCardImage';
import LinearProgressSimple from "../components/LinearProgressSimple";

abstract class IComponentNameProps implements IComponentProps {
    location: {
        query: {
            contactId: string;
            userId: string;
            roomId: string;
            username: string;
        }
    };
    params;
    router;
    dispatch;
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
};

interface IComponentNameState {
    dialogTitle: string;
    openState: boolean;
    closeLabel: string;
};

class UploadingDialog extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            dialogTitle: "Uploading...",
            openState: false,
            closeLabel: "Cancel"
        }

        this.closeDialog = this.closeDialog.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let {chatroomReducer} = nextProps as IComponentNameProps;
        let self = this;

        switch (chatroomReducer.state) {
            case ChatroomRx.CHATROOM_UPLOAD_FILE:
                this.setState(previouseState => ({ ...previouseState, openState: true }));
                break;
            case ChatroomRx.CHATROOM_UPLOAD_FILE_SUCCESS: {
                this.setState(previouseState => ({ ...previouseState, dialogTitle: "Upload Success!" }));
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            case ChatroomRx.CHATROOM_UPLOAD_FILE_FAILURE: {
                this.setState(previouseState => ({ ...previouseState, dialogTitle: "Upload Fail!" }));
                setTimeout(function () {
                    self.closeDialog();
                }, 3000);
                break;
            }
            default:
                break;
        }
    }

    closeDialog = () => {
        this.setState(previouseState => ({ ...previouseState, openState: false }));
    }

    cancelFileUpload = () => {
        let {chatroomReducer} = this.props as IComponentNameProps;

        if (chatroomReducer.state == ChatroomRx.CHATROOM_UPLOAD_FILE) {
            this.props.dispatch(ChatroomRx.uploadFileCanceled());
        }

        this.closeDialog();
    }

    public render(): JSX.Element {
        let {chatroomReducer} = this.props as IComponentNameProps;

        const actions = [
            <FlatButton
                label={this.state.closeLabel}
                primary={true}
                onClick={this.cancelFileUpload}
                />
        ];

        return (
            <MuiThemeProvider>
                <Dialog
                    title={this.state.dialogTitle}
                    actions={actions}
                    modal={true}
                    open={this.state.openState}
                    >
                    <SimpleCardImage src={chatroomReducer.uploadingFile} />

                    <Flex p={2} align='center'>
                        <LinearProgressSimple />
                    </Flex>
                </Dialog>
            </MuiThemeProvider>
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
export default connect(mapStateToProps)(UploadingDialog);
