import * as React from "react";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";

interface MyProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText?: string;
    imageSrc: string;
}
export const CardFileWithAvatar = (props: MyProps) => (
    <Card>
        <CardHeader
            title={<span style={{ color: "blue" }}>{props.title}</span>}
            subtitle={<span>{props.subtitle}</span>}
            avatar={props.avatar}
        />
        <CardText style={{ color: "black", marginLeft: 15 }}>
            {props.cardText}
        </CardText>
        <CardMedia>
            <img src={props.imageSrc} width="100%" alt={`Image preview: ${props.cardText}`} />
        </CardMedia>
    </Card>
);