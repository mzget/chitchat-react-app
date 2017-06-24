import * as React from 'react';
import { Card, CardMedia } from 'material-ui/Card';
const SimpleCardImage = (props) => (React.createElement(Card, null,
    React.createElement(CardMedia, null,
        React.createElement("img", { src: props.src, width: '100%', alt: "Image preview..." }))));
export default SimpleCardImage;
