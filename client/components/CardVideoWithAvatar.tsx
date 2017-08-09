import * as React from "react";

import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { grey400, darkBlack, lightBlack, indigo900 } from "material-ui/styles/colors";

import { small_card_width, medium_card_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';

interface ICompProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText?: string;
    src: any;
    readers: string;
    onClickReader: () => void;
    bg_color: any;
}

export const CardVideoWithAvatar = (props: ICompProps) => (
    <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_card_width : small_card_width, margin: 4, backgroundColor: props.bg_color }}>
        <CardHeader
            title={props.title}
            subtitle={props.subtitle}
            avatar={props.avatar}
        />
        <CardText style={{ color: "black", marginLeft: 15 }}>
            {props.cardText}
        </CardText>
        <CardMedia>
            <video controls preload="metadata">
                <source src={props.src} />
                Sorry; your browser doesn't support HTML5 video.
            </video>
        </CardMedia>
        {
            (!!props.readers && props.readers.length) ? (
                <div>
                    <Divider inset={false} />
                    <p style={{ paddingLeft: 10, fontFamily: "Roboto", fontSize: 12, color: indigo900 }} onClick={props.onClickReader}>{props.readers}</p>
                </div>
            ) : null
        }
    </Card>
);