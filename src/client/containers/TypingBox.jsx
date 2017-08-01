import * as React from "react";
import Flexbox from "flexbox-react";
import { TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import * as Colors from "material-ui/styles/colors";
import * as FileReaderInput from "react-file-reader-input";
import { small_body_width, large_body_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
const styles = {
    span: {
        paddingRight: 2
    }
};
const FileReaderBox = (props) => (<FileReaderInput as="url" id="file-input" onChange={props.fileReaderChange} disabled={props.disabled}>
        <IconButton disabled={props.disabled}>
            <FontIcon className="material-icons">attachment</FontIcon>
        </IconButton>
    </FileReaderInput>);
const SendButton = (props) => (<IconButton onClick={props.onSubmit} disabled={props.disabled}>
        <FontIcon className="material-icons">send</FontIcon>
    </IconButton>);
const StickerButton = (props) => (<IconButton onClick={props.onSticker} disabled={props.disabled}>
        <FontIcon className="material-icons">insert_emoticon</FontIcon>
    </IconButton>);
const PlaceButton = (props) => (<IconButton onClick={props.onLocation} disabled={props.disabled}>
        <FontIcon className="material-icons">place</FontIcon>
    </IconButton>);
export const TypingBox = (props) => {
    return (<MuiThemeProvider>
            <div id={"typing_box"} style={{ margin: 2, backgroundColor: Colors.darkWhite, width: window.innerWidth >= LARGE_TABLET ? large_body_width : small_body_width }}>
                <Flexbox>
                    <PlaceButton {...props}/>
                    <StickerButton {...props}/>
                    <FileReaderBox {...props}/>
                    <TextField disabled={props.disabled} hintText={(props.disabled) ? "Chat room disabled!" : "Type your message"} value={props.value} onChange={props.onValueChange} onKeyDown={(e) => {
        if (e.key === "Enter")
            props.onSubmit();
    }} fullWidth={true}/>
                    <SendButton {...props}/>
                </Flexbox>
            </div>
        </MuiThemeProvider>);
};
