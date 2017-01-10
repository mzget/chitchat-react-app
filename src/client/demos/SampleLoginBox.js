"use strict";
const React = require("react");
const SampleLoginForm_1 = require("./SampleLoginForm");
;
;
class SampleLoginBox extends React.Component {
    componentWillMount() {
        this.state = {
            username: ''
        };
        this.onUsername = this.onUsername.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    onUsername(event, text) {
        this.setState({ username: text });
    }
    onSubmitForm() {
        this.setState({ username: '' });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SampleLoginForm_1.SampleLoginForm, { value: this.state.username, onValueChange: this.onUsername, onSubmit: this.onSubmitForm })));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SampleLoginBox;
