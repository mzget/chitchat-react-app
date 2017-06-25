import * as React from "react";
import { connect } from "react-redux";
import Flexbox from "flexbox-react";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import { IComponentProps } from "../utils/IComponentProps";

import * as ChatroomRx from "../chitchat/chats/redux/chatroom/chatroomRxEpic";

import SimpleCardImage from "../components/SimpleCardImage";
import SimpleCardVideo from "../components/SimpleCardVideo";
import { LinearProgressSimple } from "../components/LinearProgressSimple";

import * as FileType from "../chitchat/shared/FileType";

interface IComponentNameState {
    dialogTitle: string;
    openState: boolean;
    closeLabel: string;
};

class UploadingDialog extends React.Component<IComponentProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            dialogTitle: "Uploading...",
            openState: false,
            closeLabel: "Cancel"
        };

        this.closeDialog = this.closeDialog.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { chatroomReducer } = nextProps;
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
        let { chatroomReducer } = this.props as IComponentProps;

        if (chatroomReducer.state == ChatroomRx.CHATROOM_UPLOAD_FILE) {
            this.props.dispatch(ChatroomRx.uploadFileCanceled());
        }

        this.closeDialog();
    }

    public render(): JSX.Element {
        let { chatroomReducer } = this.props as IComponentProps;

        const actions = [
            <FlatButton
                label={this.state.closeLabel}
                primary={true}
                onClick={this.cancelFileUpload}
            />
        ];

        const getMediaCard = () => {
            if (chatroomReducer.fileInfo.type.match(FileType.imageType)) {
                return (< SimpleCardImage src={chatroomReducer.uploadingFile} />);
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.textType)) {
                return null;
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.videoType)) {
                return (< SimpleCardVideo src={chatroomReducer.uploadingFile} />);
            }
        };

        return (
            <MuiThemeProvider>
                <Dialog
                    title={this.state.dialogTitle}
                    actions={actions}
                    modal={true}
                    open={this.state.openState}
                >
                    {
                        (this.state.openState) ?
                            getMediaCard() : null
                    }
                    <Flexbox alignItems="center">
                        <LinearProgressSimple />
                    </Flexbox>
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
