import * as React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

interface MyProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText: string;
}

const CardTextWithAvatar = (props: MyProps) => (
    <Card>
        <CardHeader
            title={<span style={{ color: "blue" }}>{props.title}</span>}
            subtitle={<span>{props.subtitle}</span>}
            avatar={props.avatar}
            />
        <CardText style={{ color: 'black', marginLeft: 15 }}>
            {props.cardText}
        </CardText>
    </Card>
);

export default CardTextWithAvatar;