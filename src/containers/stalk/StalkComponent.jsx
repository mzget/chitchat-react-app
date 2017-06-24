import * as React from "react";
import { connect } from "react-redux";
import { WarningBar } from "../../components/WarningBar";
import { LinearProgressDialog } from "../../components/LinearProgressDialog";
import * as StalkBridgeActions from "../../chitchat/chats/redux/stalkBridge/stalkBridgeActions";
class StalkComponent extends React.Component {
    render() {
        return (<div style={{ width: "100%" }}>
                {(this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT_FAILURE ||
            this.props.stalkReducer.state === StalkBridgeActions.STALK_CONNECTION_PROBLEM) ?
            <WarningBar /> : null}
                {(this.props.stalkReducer.state === StalkBridgeActions.STALK_INIT) ?
            <LinearProgressDialog title={"Joining... stalk service"} open={true} handleClose={() => { }}/> : null}
            </div>);
    }
}
const mapStateToProps = (state) => ({
    stalkReducer: state.stalkReducer,
    userReducer: state.userReducer
});
export const StalkCompEnhancer = connect(mapStateToProps)(StalkComponent);
