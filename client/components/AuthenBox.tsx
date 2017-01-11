import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SampleLoginBox from "./SampleLoginBox";
import SignupBox from "./SignupBox";

interface IComponentNameProps {
};

interface IComponentNameState {
    showSignin: boolean;
};

class AuthenBox extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            showSignin: true
        }

        this.onSignupPressed = this.onSignupPressed.bind(this);
        this.onSigninPressed = this.onSigninPressed.bind(this);
    }

    onSignupPressed() {
        this.setState({ showSignin: false });
    }
    onSigninPressed() {
        this.setState({ showSignin: true });
    }

    public render(): JSX.Element {
        return (
            <MuiThemeProvider >
                <Flex flexColumn>
                    {
                        (this.state.showSignin) ?
                            <SampleLoginBox /> : <SignupBox />
                    }
                    {
                        (this.state.showSignin) ?
                            (<Flex justify='center' align='center' p={2}>
                                <p>New to chitchat?</p>
                                <RaisedButton primary={true} label="Sign up now" onClick={this.onSignupPressed} style={{ margin: 8 }}> </RaisedButton>
                            </Flex>) :
                            (<Flex justify='center' align='center' p={2}>
                                <p>Already have account?</p>
                                <RaisedButton primary={true} label="Sign in" onClick={this.onSigninPressed} style={{ margin: 8 }}> </RaisedButton>
                            </Flex>)
                    }
                </Flex>
            </MuiThemeProvider >);
    }
}

export default AuthenBox;
