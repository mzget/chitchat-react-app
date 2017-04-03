import * as React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const SimpleCardVideo = (props: { src: any }) => (
    <Card>
        <CardMedia>
            <video preload='metadata'>
                <source src={props.src} />
                Sorry; your browser doesn't support HTML5 video.
            </video>
        </CardMedia>
    </Card>
);

export default SimpleCardVideo;