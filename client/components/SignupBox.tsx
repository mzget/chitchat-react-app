import * as React from "react";

import { SignupForm } from './SignupForm';

interface IComponentNameProps { };

interface IComponentNameState { };

class SignupBox extends React.Component<IComponentNameProps, IComponentNameState> {
    public render(): JSX.Element {
        return (
            <span>
                <SignupForm />
            </span>
        );
    }
}

export default SignupBox;
