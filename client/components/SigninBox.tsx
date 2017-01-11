import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SampleLoginBox from "./SampleLoginBox";

interface IComponentNameProps { };

interface IComponentNameState { };

class SigninBox extends React.Component<IComponentNameProps, IComponentNameState> {
    public render(): JSX.Element {
        return (
            <MuiThemeProvider >
                <Flex flexColumn>
                    <SampleLoginBox />
                    <Flex justify='center' align='center' p={2}>
                        <p>New to chitchat?</p>
                        <RaisedButton primary={true} label="Sign up now!" onClick={null} style={{ margin: 8 }}> </RaisedButton>
                    </Flex>
                </Flex>
            </MuiThemeProvider >);
    }
}

export default SigninBox;
