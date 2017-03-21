import * as React from "react";
import FlatButton from "material-ui/FlatButton";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from "material-ui/Card";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

interface MyProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText: string;
}

export const CardTextWithAvatar = (props: MyProps) => (
    <div style={{ padding: 2, color: grey400 }}>
        <Card>
            <CardHeader
                title={<span style={{ color: "blue" }}>{props.title}</span>}
                subtitle={<span>{props.subtitle}</span>}
                avatar={props.avatar}
            />
            <CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </CardText>
        </Card>
    </div>
);