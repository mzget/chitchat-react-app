import * as React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const SimpleCardImage = (props: { src: any }) => (
    <Card>
        <CardMedia>
            <img src={props.src} width='100%' alt="Image preview..." />
        </CardMedia>
    </Card>
);

export default SimpleCardImage;