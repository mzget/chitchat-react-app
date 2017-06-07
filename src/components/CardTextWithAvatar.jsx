"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var colors_1 = require("material-ui/styles/colors");
exports.CardTextWithAvatar = function (props) { return (<div style={{ padding: 2, color: colors_1.grey400 }}>
        <Card_1.Card>
            <Card_1.CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <Card_1.CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </Card_1.CardText>
        </Card_1.Card>
    </div>); };
