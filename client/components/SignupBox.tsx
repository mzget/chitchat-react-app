import * as React from "react";

import { SignupForm } from './SignupForm';

interface IComponentNameProps { };

interface IComponentNameState {
    email: string;
    password: string;
    confirmPassword: string;
    firstname: string;
    lastname: string;
};

class SignupBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: ''
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    onSubmitForm() {
        console.log("submit form", this.state);
    }

    public render(): JSX.Element {
        return (
            <span>
                <SignupForm
                    email={this.state.email} onEmailChange={(e, text) => {
                        this.setState(previous => ({ ...previous, email: text }))
                    } }
                    password={this.state.password} onPasswordChange={(e, text) => {
                        this.setState(previous => ({ ...previous, password: text }))
                    } }
                    confirmPassword={this.state.confirmPassword} onConfirmPasswordChange={(e, text) => {
                        this.setState(previous => ({ ...previous, confirmPassword: text }))
                    } }
                    firstname={this.state.firstname} onFirstnameChange={(e, text) => {
                        this.setState(previous => ({ ...previous, firstname: text }))
                    } }
                    lastname={this.state.lastname} onLastnameChange={(e, text) => {
                        this.setState(previous => ({ ...previous, lastname: text }))
                    } }
                    onSubmit={this.onSubmitForm}
                    />
            </span>
        );
    }
}

export default SignupBox;
