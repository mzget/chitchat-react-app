"use strict";
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const userRx_1 = require("../../redux/user/userRx");
const mapStateToProps = (state) => ({ userReducer: state.userReducer });
exports.AddMemberEnhancer = recompose_1.compose(react_redux_1.connect(mapStateToProps), recompose_1.withState("search", "setSearch", ""), recompose_1.withState("members", "setMembers", []), recompose_1.lifecycle({
    componentWillReceiveProps(nextProps) {
        let { searchUsers } = nextProps.userReducer;
        if (!recompose_1.shallowEqual(searchUsers, this.props.members)) {
            this.props.setMembers(members => searchUsers);
        }
    }
}), recompose_1.withHandlers({
    onSearch: (props) => () => {
        props.dispatch(userRx_1.suggestUser(props.search, null));
    },
    onselectMember: (props) => item => {
        console.log(props, item);
    },
    onTextChanged: (props) => (e, value) => {
        props.setSearch(search => value);
    }
}));
