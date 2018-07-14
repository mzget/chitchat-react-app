import * as React from "react";
import { SigninForm } from "../../components/SigninForm";
export class SigninBox extends React.Component {
    componentWillMount() {
        this.state = {
            username: "",
            password: "",
        };
        this.onUsername = this.onUsername.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }
    onUsername(event, text) {
        this.setState((previous) => (Object.assign({}, previous, { username: text })));
    }
    onPassword(event, text) {
        this.setState((previous) => (Object.assign({}, previous, { password: text })));
    }
    onSubmitForm() {
        const username = this.state.username;
        const password = this.state.password;
        this.props.onLogingIn(username, password);
        this.setState({ username: "", password: "" });
    }
    render() {
        return (<div>
                <SigninForm username={this.state.username} onUsername={this.onUsername} password={this.state.password} onPassword={this.onPassword} onSubmit={this.onSubmitForm}/>
            </div>);
    }
}
