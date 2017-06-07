"use strict";
var React = require("react");
var Card_1 = require("material-ui/Card");
var SimpleCardVideo = function (props) { return (<Card_1.Card>
        <Card_1.CardMedia>
            <video preload='metadata'>
                <source src={props.src}/>
                Sorry; your browser doesn't support HTML5 video.
            </video>
        </Card_1.CardMedia>
    </Card_1.Card>); };
exports.__esModule = true;
exports["default"] = SimpleCardVideo;
