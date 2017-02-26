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

interface ITypingBox {
    onSubmit: () => void;
    onSticker?: () => void;
    value: string;
    onValueChange: (text) => void;
    fileReaderChange: (e, results) => void;
    disabled: boolean;
    styles?: any;
}

const FileReaderBox = (props: ITypingBox) => (
    <FileReaderInput as="url" id="file-input" onChange={props.fileReaderChange} disabled={props.disabled}>
        <IconButton disabled={props.disabled}>
            <FontIcon className="material-icons">attachment</FontIcon>
        </IconButton>
    </FileReaderInput>
);

const SendButton = (props: ITypingBox) => (
    <IconButton onClick={props.onSubmit} disabled={props.disabled} >
        <FontIcon className="material-icons">send</FontIcon>
    </IconButton>
);

const StickerButton = (props: ITypingBox) => (
    <IconButton onClick={props.onSticker} disabled={props.disabled} >
        <FontIcon className="material-icons">insert_emoticon</FontIcon>
    </IconButton>
);

export const TypingBox = (props: ITypingBox) => {
    return (
        < MuiThemeProvider >
            <div style={props.styles} id={"typing_box"} >
                <Flex>
                    <StickerButton {...props} />
                    <FileReaderBox {...props} />
                    <TextField
                        disabled={props.disabled}
                        hintText={(props.disabled) ? "Chat room disabled!" : "Type your message"}
                        value={props.value}
                        onChange={props.onValueChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") props.onSubmit();
                        }} />
                    <SendButton {...props} />
                </Flex>
            </div>
        </MuiThemeProvider >
    );
};