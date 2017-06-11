import * as React from "react";

import Divider from 'material-ui/Divider';
import FlatButton from "material-ui/FlatButton";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from "material-ui/Card";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

interface ICompProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText: string;
    readers: string;
    onClickReader: () => void;
}

export const CardTextWithAvatar = (props: ICompProps) => (
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
            {
                (!!props.readers && props.readers.length) ? (
                    <div>
                        <Divider inset={false} />
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>
                ) : null
            }
        </Card>
    </div>
);