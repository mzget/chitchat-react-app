import * as React from "react";
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardMedia, CardText } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
import { small_card_width, medium_card_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
export const CardVideoWithAvatar = (props) => (<div style={{ padding: 2, color: grey400, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_card_width : small_card_width }}>
            <CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </CardText>
            <CardMedia>
                <video controls preload="metadata">
                    <source src={props.src}/>
                    Sorry; your browser doesn't support HTML5 video.
            </video>
            </CardMedia>
            {(!!props.readers && props.readers.length) ? (<div>
                        <Divider inset={false}/>
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>) : null}
        </Card>
    </div>);
