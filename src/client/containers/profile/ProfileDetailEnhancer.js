"use strict";
const React = require("react");
const react_redux_1 = require("react-redux");
const recompose_1 = require("recompose");
const ProfileDetail_1 = require("./ProfileDetail");
const enhance = recompose_1.compose(recompose_1.withState("user", "updateUser", ({ user }) => user), recompose_1.withHandlers({
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
    onTelNumberChange: (props) => (event, newValue) => {
        let user = props.user;
        user["tel"] = newValue;
        props.updateUser(prev => user);
    },
    onSubmit: (props) => () => {
        // props.dispatch(editGroupRxActions.editGroupMember(payload));
        console.log("bobo", props);
    }
}));
const ProfileDetailEnhancer = enhance(({ user, teamProfile, onFirstNameChange, onLastNameChange, onTelNumberChange, onSubmit, onFileReaderChange }) => React.createElement(ProfileDetail_1.ProfileDetail, { user: user, teamProfile: teamProfile, onFirstNameChange: onFirstNameChange, onLastNameChange: onLastNameChange, onTelNumberChange: onTelNumberChange, onFileReaderChange: onFileReaderChange, onSubmit: onSubmit }));
exports.ConnectProfileDetailEnhancer = react_redux_1.connect()(ProfileDetailEnhancer);
