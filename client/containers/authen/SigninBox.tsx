import * as React from "react";

import { SigninForm } from "../../components/SigninForm";

interface IComponentNameProps {
    onLogingIn: (username, password) => void;
}

interface IComponentNameState {
    username: string;
    password: string;
}

export class SigninBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            username: "",
            password: "",
        };

        this.onUsername = this.onUsername.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    onUsername(event, text: string) {
        this.setState((previous) => ({ ...previous, username: text }));
    }
    onPassword(event, text: string) {
        this.setState((previous) => ({ ...previous, password: text }));
    }

    public onSubmitForm() {
        const username = this.state.username;
        const password = this.state.password;

        this.props.onLogingIn(username, password);

        this.setState({ username: "", password: "" });
    }

    public render(): JSX.Element {
        return (
            <div>
                <SigninForm
                    username={this.state.username}
                    onUsername={this.onUsername}
                    password={this.state.password}
                    onPassword={this.onPassword}
                    onSubmit={this.onSubmitForm} />
            </div>
        );
    }
}
