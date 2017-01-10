import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

const styles = {
    span: {
        paddingRight: 2
    },
    button: {
        margin: 12
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};

const SubmitButton = (props: ITypingBox) => (
    <RaisedButton primary={true} label="submit" onClick={props.onSubmit} style={styles.button}>
    </RaisedButton>
);

interface ITypingBox {
    onSubmit: () => void;
    value: string;
    onValueChange: (event, text) => void;
}

export const SampleLoginForm = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flex>
                <span style={styles.span} />
                <TextField hintText="Type username here." value={props.value} onChange={props.onValueChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <SubmitButton {...props} />
            </Flex>
        </MuiThemeProvider >
    );
}