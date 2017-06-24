import * as React from "react";
import { Flex } from "reflexbox";
import { TextField } from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import * as Colors from "material-ui/styles/colors";
import * as FileReaderInput from "react-file-reader-input";
const styles = {
    span: {
        paddingRight: 2
    }
};
const FileReaderBox = (props) => (React.createElement(FileReaderInput, { as: "url", id: "file-input", onChange: props.fileReaderChange, disabled: props.disabled },
    React.createElement(IconButton, { disabled: props.disabled },
        React.createElement(FontIcon, { className: "material-icons" }, "attachment"))));
const SendButton = (props) => (React.createElement(IconButton, { onClick: props.onSubmit, disabled: props.disabled },
    React.createElement(FontIcon, { className: "material-icons" }, "send")));
const StickerButton = (props) => (React.createElement(IconButton, { onClick: props.onSticker, disabled: props.disabled },
    React.createElement(FontIcon, { className: "material-icons" }, "insert_emoticon")));
const PlaceButton = (props) => (React.createElement(IconButton, { onClick: props.onLocation, disabled: props.disabled },
    React.createElement(FontIcon, { className: "material-icons" }, "place")));
export const TypingBox = (props) => {
    return (React.createElement(MuiThemeProvider, null,
        React.createElement("div", { id: "typing_box", style: { margin: 2, backgroundColor: Colors.darkWhite } },
            React.createElement(Flex, null,
                React.createElement(PlaceButton, Object.assign({}, props)),
                React.createElement(StickerButton, Object.assign({}, props)),
                React.createElement(FileReaderBox, Object.assign({}, props)),
                React.createElement(TextField, { disabled: props.disabled, hintText: (props.disabled) ? "Chat room disabled!" : "Type your message", value: props.value, onChange: props.onValueChange, onKeyDown: (e) => {
                        if (e.key === "Enter")
                            props.onSubmit();
                    }, fullWidth: true }),
                React.createElement(SendButton, Object.assign({}, props))))));
};
