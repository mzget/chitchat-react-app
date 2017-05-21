import * as React from 'react';
import { Card, CardMedia } from 'material-ui/Card';
const SimpleCardVideo = (props) => (React.createElement(Card, null,
    React.createElement(CardMedia, null,
        React.createElement("video", { preload: 'metadata' },
            React.createElement("source", { src: props.src }),
            "Sorry; your browser doesn't support HTML5 video."))));
export default SimpleCardVideo;
