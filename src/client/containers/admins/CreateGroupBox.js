"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require("react");
const react_redux_1 = require("react-redux");
const CreateGroupForm_1 = require("./CreateGroupForm");
;
;
class CreateGroupBox extends React.Component {
    componentWillMount() {
        this.state = {
            groupImage: "",
            groupName: "",
            groupDescription: ""
        };
        this.onSubmitGroup = this.onSubmitGroup.bind(this);
    }
    onSubmitGroup() {
        console.log("submit group", this.state);
        if (this.state.groupName.length > 0) {
        }
        else {
            this.props.onError("Missing some require field");
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(CreateGroupForm_1.CreateGroupForm, { image: this.state.groupImage, group_name: this.state.groupName, onGroupNameChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { groupName: text })));
                }, group_description: this.state.groupDescription, onGroupDescriptionChange: (e, text) => {
                    this.setState(previous => (__assign({}, previous, { groupDescription: text })));
                }, onSubmit: this.onSubmitGroup })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_redux_1.connect()(CreateGroupBox);
