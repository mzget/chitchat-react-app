import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { shallowEqual, compose } from "recompose";
import * as chatroom from "../../chitchat/chats/redux/chatroom/";
import * as calling from "../../chitchat/calling/";
import { WithDialog } from "../toolsbox/DialogBoxEnhancer";
import { VideoCallSample } from "./";
class VideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMuteAudio: false,
            isPauseVideo: false,
            micVol: 100,
        };
        this.onBackPressed = this.onBackPressed.bind(this);
        this.onTitlePressed = this.onTitlePressed.bind(this);
    }
    componentWillMount() {
        if (!this.props.teamReducer.team) {
            this.props.history.replace("/");
        }
    }
    componentWillReceiveProps(nextProps) {
        let prevInline = this.props.stalkReducer.get("inline");
        let nextInline = nextProps.stalkReducer.get("inline");
        if (!nextInline && !shallowEqual(nextInline, prevInline)) {
            this.onBackPressed();
        }
    }
    componentWillUnmount() {
        this.props.dispatch(calling.onVideoCallEnded());
        let { match, userReducer: { user }, stalkReducer } = this.props;
        let room_id = match.params.id;
        let room = chatroom.getRoom(room_id);
        let targets = new Array();
        if (!!room && room.members.length > 0) {
            room.members.map(value => {
                if (value._id !== user._id) {
                    targets.push(value._id);
                }
            });
        }
        this.props.dispatch(calling.hangupCallRequest({ target_ids: targets, user_id: user._id }));
    }
    onBackPressed() {
        this.props.history.goBack();
    }
    onTitlePressed() {
        let { history, teamReducer } = this.props;
        history.replace(`/team/${teamReducer.team._id}`);
    }
    render() {
        return (<VideoCallSample />);
    }
}
const mapStateToProps = (state) => ({
    userReducer: state.userReducer,
    alertReducer: state.alertReducer,
    teamReducer: state.teamReducer,
    stalkReducer: state.stalkReducer
});
const enhance = compose(WithDialog, withRouter, connect(mapStateToProps));
export const VideoCallPage = enhance(VideoCall);
