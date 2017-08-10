import * as React from "react";
import { connect } from "react-redux";
import Flexbox from "flexbox-react";
import { shallowEqual } from "recompose";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as ChatroomRx from "../chitchat/chats/redux/chatroom/chatroomRxEpic";
import SimpleCardImage from "../components/SimpleCardImage";
import SimpleCardVideo from "../components/SimpleCardVideo";
import { LinearProgressSimple } from "../components/LinearProgressSimple";
import * as FileType from "../chitchat/shared/FileType";
;
class UploadingDialog extends React.Component {
    constructor() {
        super(...arguments);
        this.closeDialog = () => {
            this.setState(previouseState => (Object.assign({}, previouseState, { openState: false })));
        };
        this.cancelFileUpload = () => {
            let { chatroomReducer } = this.props;
            if (chatroomReducer.get("uploading") == true) {
                this.props.dispatch(ChatroomRx.uploadFileCanceled());
            }
            this.closeDialog();
        };
    }
    componentWillMount() {
        this.state = {
            dialogTitle: "Uploading...",
            openState: false,
            closeLabel: "Cancel"
        };
        this.closeDialog = this.closeDialog.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        let { chatroomReducer } = nextProps;
        let self = this;
        let prev = this.props.chatroomReducer.get("uploading");
        let next = chatroomReducer.get("uploading");
        if (!shallowEqual(prev, next)) {
            this.setState(previouseState => (Object.assign({}, previouseState, { openState: next })));
        }
    }
    render() {
        let { chatroomReducer } = this.props;
        const actions = [
            <FlatButton label={this.state.closeLabel} primary={true} onClick={this.cancelFileUpload}/>
        ];
        const getMediaCard = () => {
            if (chatroomReducer.fileInfo.type.match(FileType.imageType)) {
                return (<SimpleCardImage src={chatroomReducer.uploadingFile}/>);
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.textType)) {
                return null;
            }
            else if (chatroomReducer.fileInfo.type.match(FileType.videoType)) {
                return (<SimpleCardVideo src={chatroomReducer.uploadingFile}/>);
            }
        };
        return (<MuiThemeProvider>
                <Dialog contentStyle={{ width: "350px" }} title={this.state.dialogTitle} actions={actions} modal={true} open={this.state.openState}>
                    <Flexbox alignItems="center">
                        <LinearProgressSimple />
                    </Flexbox>
                    {(this.state.openState) ?
            getMediaCard() : null}
                </Dialog>
            </MuiThemeProvider>);
    }
}
function mapStateToProps(state) {
    return {
        chatroomReducer: state.chatroomReducer
    };
}
export default connect(mapStateToProps)(UploadingDialog);
