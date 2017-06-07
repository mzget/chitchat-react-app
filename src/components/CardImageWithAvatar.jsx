"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var colors_1 = require("material-ui/styles/colors");
exports.CardImageWithAvatar = function (props) { return (<div style={{ padding: 2, color: colors_1.grey400 }}>
        <Card_1.Card>
            <Card_1.CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <Card_1.CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </Card_1.CardText>
            <Card_1.CardMedia>
                <img src={props.imageSrc} style={{ padding: 5 }} alt={"Image preview: " + props.cardText}/>
            </Card_1.CardMedia>
        </Card_1.Card>
    </div>); };
exports.CardStickerWithAvatar = function (props) { return (<div style={{ padding: 2, color: colors_1.grey400 }}>
        <Card_1.Card>
            <Card_1.CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <Card_1.CardMedia>
                <img src={props.imageSrc} alt={"Image preview:"} style={{ padding: 4, width: "50%", minWidth: "128px", maxWidth: "160px" }}/>
            </Card_1.CardMedia>
        </Card_1.Card>
    </div>); };
