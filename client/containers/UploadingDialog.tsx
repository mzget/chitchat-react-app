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
import CircularProgressSimple from "../components/CircularProgressSimple";

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
    userReducer;
    chatroomReducer;
    chatlogReducer;
    stalkReducer;
};

interface IComponentNameState {
    openState: boolean;
};

class UploadingDialog extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            openState: false
        }
    }

    componentWillReceiveProps(nextProps: IComponentNameProps) {
        let {chatroomReducer} = nextProps as IComponentNameProps;

        switch (chatroomReducer.state) {
            case ChatroomRx.CHATROOM_UPLOAD_FILE:
                this.setState(previouseState => ({ ...previouseState, openState: true }));
                break;

            default:
                break;
        }
    }

    actions = [
        <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={() => this.setState(previousState => ({ ...previousState, openState: false }))}
            />
    ];

    public render(): JSX.Element {
        let {chatroomReducer} = this.props as IComponentNameProps;

        return (
            <MuiThemeProvider>
                <Dialog
                    title="Uploading..."
                    actions={this.actions}
                    modal={true}
                    open={this.state.openState}
                    >
                    <SimpleCardImage src={chatroomReducer.uploadingFile} />

                    <Flex p={2} align='center'>
                        <Box p={2} flexAuto></Box>
                        <CircularProgressSimple />
                        <Box p={2} flexAuto></Box>
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
