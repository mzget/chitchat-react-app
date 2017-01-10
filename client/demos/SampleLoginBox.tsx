import * as React from "react";

import { SampleLoginForm } from './SampleLoginForm';

interface IComponentNameProps { };

interface IComponentNameState {
    username: string;
};

class SampleLoginBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            username: ''
        }

        this.onUsername = this.onUsername.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
    }

    onUsername(event, text: string) {
        this.setState({ username: text });
    }

    onSubmitForm() {
        this.setState({ username: '' });
    }

    public render(): JSX.Element {
        return (
            <div>
                <SampleLoginForm value={this.state.username} onValueChange={this.onUsername} onSubmit={this.onSubmitForm} />
            </div>
        );
    }
}

export default SampleLoginBox;
