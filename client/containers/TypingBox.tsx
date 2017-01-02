import * as React from "react";
import { Flex, Box } from 'reflexbox';
import { RaisedButton, TextField } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as FileReaderInput from 'react-file-reader-input';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const styles = {
    span: {
        paddingRight: 2
    },
    box: {
        bottom: 0,
        position: 'absolute'
    }
};


const handleChange = (e, results) => {
    results.forEach(result => {
        const [e, file] = result;
        // this.props.dispatch(uploadFile(e.target.result));
        console.log(`Successfully uploaded ${file.name}!`, e);
    });
}

export const FileReaderBox = (props) => (
    <FileReaderInput id="file-input" onChange={handleChange}>
        <IconButton>
            <FontIcon className="material-icons">attachment</FontIcon>
        </IconButton>
    </FileReaderInput>
);

export const SendButton = (props) => (
    <IconButton onClick={props.onSubmit} >
        <FontIcon className="material-icons">send</FontIcon>
    </IconButton>
);

export const TypingBox = (props) => {
    return (
        < MuiThemeProvider >
            <Flex>
                <FileReaderBox />
                <span style={styles.span} />
                <TextField hintText="Type your message" value={props.value} onChange={props.onValueChange} onKeyDown={(e) => {
                    if (e.key === 'Enter') props.onSubmit();
                } } />
                <span style={styles.span} />
                <SendButton onSubmit={props.onSubmit} />
            </Flex>
        </MuiThemeProvider >
    );
}