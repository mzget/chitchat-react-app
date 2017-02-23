import * as React from "react";
import { Flex, Box } from "reflexbox";
import { RaisedButton, TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as FileReaderInput from "react-file-reader-input";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";

const styles = {
    span: {
        paddingRight: 2
    }
};

const FileReaderBox = (props: ITypingBox) => (
    <FileReaderInput as="url" id="file-input" onChange={props.fileReaderChange}>
        <IconButton>
            <FontIcon className="material-icons">attachment</FontIcon>
        </IconButton>
    </FileReaderInput>
);

const SendButton = (props: ITypingBox) => (
    <IconButton onClick={props.onSubmit} >
        <FontIcon className="material-icons">send</FontIcon>
    </IconButton>
);

const StickerButton = (props: ITypingBox) => (
    <IconButton onClick={props.onSticker} >
        <FontIcon className="material-icons">insert_emoticon</FontIcon>
    </IconButton>
);

interface ITypingBox {
    onSubmit: () => void;
    onSticker?: () => void;
    value: string;
    onValueChange: (text) => void;
    fileReaderChange: (e, results) => void;

    styles?: any;
}

export const TypingBox = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <div style={props.styles}>
                <Flex>
                    <StickerButton {...props} />
                    <FileReaderBox {...props} />
                    <TextField hintText="Type your message" value={props.value} onChange={props.onValueChange} onKeyDown={(e) => {
                        if (e.key === "Enter") props.onSubmit();
                    }} />
                    <SendButton {...props} />
                </Flex>
            </div>
        </MuiThemeProvider >
    );
};