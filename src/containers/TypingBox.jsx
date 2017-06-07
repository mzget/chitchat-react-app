"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var material_ui_1 = require("material-ui");
var MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
var FontIcon_1 = require("material-ui/FontIcon");
var IconButton_1 = require("material-ui/IconButton");
var Colors = require("material-ui/styles/colors");
var FileReaderInput = require("react-file-reader-input");
var styles = {
    span: {
        paddingRight: 2
    }
};
var FileReaderBox = function (props) { return (<FileReaderInput as="url" id="file-input" onChange={props.fileReaderChange} disabled={props.disabled}>
        <IconButton_1.default disabled={props.disabled}>
            <FontIcon_1.default className="material-icons">attachment</FontIcon_1.default>
        </IconButton_1.default>
    </FileReaderInput>); };
var SendButton = function (props) { return (<IconButton_1.default onClick={props.onSubmit} disabled={props.disabled}>
        <FontIcon_1.default className="material-icons">send</FontIcon_1.default>
    </IconButton_1.default>); };
var StickerButton = function (props) { return (<IconButton_1.default onClick={props.onSticker} disabled={props.disabled}>
        <FontIcon_1.default className="material-icons">insert_emoticon</FontIcon_1.default>
    </IconButton_1.default>); };
exports.TypingBox = function (props) {
    return (<MuiThemeProvider_1.default>
            <div id={"typing_box"} style={{ margin: 2, backgroundColor: Colors.darkWhite }}>
                <reflexbox_1.Flex>
                    <StickerButton {...props}/>
                    <FileReaderBox {...props}/>
                    <material_ui_1.TextField disabled={props.disabled} hintText={(props.disabled) ? "Chat room disabled!" : "Type your message"} value={props.value} onChange={props.onValueChange} onKeyDown={function (e) {
        if (e.key === "Enter")
            props.onSubmit();
    }} fullWidth={true}/>
                    <SendButton {...props}/>
                </reflexbox_1.Flex>
            </div>
        </MuiThemeProvider_1.default>);
};
