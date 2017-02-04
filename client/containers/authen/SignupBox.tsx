import * as React from "react";

import { SignupForm } from "../../components/SignupForm";

import * as CryptoHelper from "../../chats/utils/CryptoHelper";
import * as ValidateUtils from "../../utils/ValidationUtils";
import * as AuthRx from "../../redux/authen/authRx";

interface IComponentNameProps {
    onError: (error: string) => void;
    dispatch;
};

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
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: ""
        };

        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    onSubmitForm() {
        if (this.state.password !== this.state.confirmPassword) {
            this.props.onError("confirm password is not match!");
        }
        else if (this.state.email.length > 0 && this.state.password.length > 0) {
            ValidateUtils.validateEmailPass(this.state.email, this.state.password, (result) => {
                if (!result) {
                    if (this.state.firstname.length > 0 && this.state.lastname.length > 0) {
                        CryptoHelper.hashComputation(this.state.password).then((hash: string) => {
                            this.setState(previous => ({ ...previous, password: hash, confirmPassword: null }), () => {
                                this.props.dispatch(AuthRx.signup(this.state));
                            });
                        });
                    }
                    else {
                        this.props.onError("The require fields is missing!");
                    }
                }
                else {
                    console.warn(JSON.stringify(result));
                }
            });
        }
        else {
            this.props.onError("The require fields is missing!");
        }
    }

    public render(): JSX.Element {
        return (
            <span>
                <SignupForm
                    email={this.state.email} onEmailChange={(e, text) => {
                        this.setState(previous => ({ ...previous, email: text }));
                    }}
                    password={this.state.password} onPasswordChange={(e, text) => {
                        this.setState(previous => ({ ...previous, password: text }));
                    }}
                    confirmPassword={this.state.confirmPassword} onConfirmPasswordChange={(e, text) => {
                        this.setState(previous => ({ ...previous, confirmPassword: text }));
                    }}
                    firstname={this.state.firstname} onFirstnameChange={(e, text) => {
                        this.setState(previous => ({ ...previous, firstname: text }));
                    }}
                    lastname={this.state.lastname} onLastnameChange={(e, text) => {
                        this.setState(previous => ({ ...previous, lastname: text }));
                    }}
                    onSubmit={this.onSubmitForm}
                />
            </span>
        );
    }
}

export default SignupBox;
