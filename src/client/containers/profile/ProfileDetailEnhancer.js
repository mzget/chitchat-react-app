"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const ProfileDetail_1 = require("./ProfileDetail");
const enhance = recompose_1.compose(recompose_1.withState("user", "updateUser", ({ user }) => user), 
// lifecycle({
//     componentWillMount() {
//         this.props.updateMembers(member => this.props.initMembers);
//     }
// }),
recompose_1.withHandlers({
    onFirstNameChange: (props) => (event, newValue) => {
        let user = props.user;
        user["firstname"] = newValue;
        props.updateUser(prev => user);
    },
    onLastNameChange: (props) => (event, newValue) => {
        let user = props.user;
        user["lastname"] = newValue;
        props.updateUser(prev => user);
    },
    onSubmit: (props) => () => {
        // let payload = { room_id: props.room_id, members: props.members };
        // props.dispatch(editGroupRxActions.editGroupMember(payload));
        console.log("bobo", props);
    }
}));
const ProfileDetailEnhancer = enhance(({ user, onFirstNameChange, onLastNameChange, onSubmit, onFileReaderChange }) => React.createElement(ProfileDetail_1.ProfileDetail, { image: user.avatar, first_name: user.firstname, last_name: user.lastname, email: user.email, onFirstNameChange: onFirstNameChange, onLastNameChange: onLastNameChange, onFileReaderChange: onFileReaderChange, onSubmit: onSubmit }));
exports.ConnectProfileDetailEnhancer = react_redux_1.connect()(ProfileDetailEnhancer);
