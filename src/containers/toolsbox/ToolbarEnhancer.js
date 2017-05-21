import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
const mapStateToProps = (state) => ({
    chatroomReducer: state.chatroomReducer,
    teamReducer: state.teamReducer
});
export const ToolbarEnhancer = compose(connect(mapStateToProps), withHandlers({
    onMenuSelect: (props) => (id, value) => {
        props.listener(props, id, value);
    },
    onBackPressed: (props) => () => {
        props.history.goBack();
    },
    onPressTitle: (props) => (e) => {
        props.history.replace(`/chatslist/${props.teamReducer.team.name}`);
    }
}));
