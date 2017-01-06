import * as React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

interface MyProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText?: string;
    src: any;
}

const CardVideoWithAvatar = (props: MyProps) => (
    <Card>
        <CardHeader
            title={<span style={{ color: "blue" }}>{props.title}</span>}
            subtitle={<span>{props.subtitle}</span>}
            avatar={props.avatar}
            />
        <CardText style={{ color: 'black', marginLeft: 15 }}>
            {props.cardText}
        </CardText>
        <CardMedia>
            <video controls preload='metadata'>
                <source src={props.src} />
                Sorry; your browser doesn't support HTML5 video.
            </video>
        </CardMedia>
    </Card>
);

export default CardVideoWithAvatar;