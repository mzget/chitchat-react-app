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


const fileReaderChange = (e, results) => {
    results.forEach(result => {
        const [e, file] = result;
        // this.props.dispatch(uploadFile(e.target.result));
        console.log(`Successfully uploaded ${file.name}!`, e);
    });
}

const FileReaderBox = (props) => (
    <FileReaderInput as='url' id="file-input" onChange={props.fileReaderChange}>
        <IconButton>
            <FontIcon className="material-icons">attachment</FontIcon>
        </IconButton>
    </FileReaderInput>
);

const SendButton = (props) => (
    <IconButton onClick={props.onSubmit} >
        <FontIcon className="material-icons">send</FontIcon>
    </IconButton>
);

interface ITypingBox {
    onSubmit: () => void;
    value: string;
    onValueChange: (text) => void;
    fileReaderChange: (e, results) => void;
}

export const TypingBox = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <Flex>
                <FileReaderBox {...props} />
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