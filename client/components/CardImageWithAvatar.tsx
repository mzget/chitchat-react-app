import * as React from "react";

import FlatButton from "material-ui/FlatButton";
import Divider from 'material-ui/Divider';
import { grey400, darkBlack, lightBlack, indigo900 } from "material-ui/styles/colors";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from "material-ui/Card";

import { small_card_width, medium_card_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';

interface ICompProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText?: string;
    imageSrc: string;
    readers: string;
    onClickReader: () => void;
    bg_color: any;
}

export const CardImageWithAvatar = (props: ICompProps) => (
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
            <img src={props.imageSrc} style={{ padding: 5, maxWidth: "100%" }} alt={`Image preview: ${props.cardText}`} />
        </CardMedia>
        {
            (!!props.readers && props.readers.length) ? (
                <div>
                    <Divider inset={false} />
                    <p style={{ paddingLeft: 5, fontSize: 12, color: indigo900 }} onClick={props.onClickReader}>{props.readers}</p>
                </div>
            ) : null
        }
    </Card>
);

export const CardStickerWithAvatar = (props: ICompProps) => (
    <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_card_width : small_card_width, margin: 4, backgroundColor: props.bg_color }}>
        <CardHeader
            title={props.title}
            subtitle={props.subtitle}
            avatar={props.avatar}
        />
        <CardMedia>
            <img src={props.imageSrc} alt={`Image preview:`} style={{ padding: 20, width: "50%", minWidth: "128px", maxWidth: "160px" }} />
        </CardMedia>
        {
            (!!props.readers && props.readers.length) ? (
                <div>
                    <Divider inset={false} />
                    <p style={{ paddingLeft: 5, fontSize: 12, color: indigo900 }} onClick={props.onClickReader}>{props.readers}</p>
                </div>
            ) : null
        }
    </Card>
);