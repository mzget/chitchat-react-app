"use strict";
var React = require("react");
var reflexbox_1 = require("reflexbox");
var Card_1 = require("material-ui/Card");
var FlatButton_1 = require("material-ui/FlatButton");
var colors_1 = require("material-ui/styles/colors");
exports.CardFileWithAvatar = function (props) { return (<div style={{ padding: 2, color: colors_1.grey400 }}>
        <Card_1.Card>
            <Card_1.CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <reflexbox_1.Flex flexColumn={false}>
                {props.fileIcon}
                <p style={{ color: colors_1.darkBlack, marginLeft: 15, fontSize: 16 }}>{props.cardText}</p>
            </reflexbox_1.Flex>
            <Card_1.CardActions>
                <FlatButton_1.default label="Open" primary={true} onClick={props.openAction}/>
            </Card_1.CardActions>
        </Card_1.Card>
    </div>); };
