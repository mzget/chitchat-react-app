"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var SimpleCardImage = function (props) { return (<Card_1.Card>
        <Card_1.CardMedia>
            <img src={props.src} width='100%' alt="Image preview..."/>
        </Card_1.CardMedia>
    </Card_1.Card>); };
exports.__esModule = true;
exports["default"] = SimpleCardImage;
