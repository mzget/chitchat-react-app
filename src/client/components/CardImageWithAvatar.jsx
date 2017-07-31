import * as React from "react";
import Divider from 'material-ui/Divider';
import { grey400 } from "material-ui/styles/colors";
import { Card, CardHeader, CardMedia, CardText } from "material-ui/Card";
import { xsmall_body_width, medium_body_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
export const CardImageWithAvatar = (props) => (<div style={{ padding: 2, color: grey400, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_body_width : xsmall_body_width }}>
            <CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </CardText>
            <CardMedia>
                <img src={props.imageSrc} style={{ padding: 20, maxWidth: "250px" }} alt={`Image preview: ${props.cardText}`}/>
            </CardMedia>
            {(!!props.readers && props.readers.length) ? (<div>
                        <Divider inset={false}/>
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>) : null}
        </Card>
    </div>);
export const CardStickerWithAvatar = (props) => (<div style={{ padding: 2, color: grey400, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_body_width : xsmall_body_width }}>
            <CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <CardMedia>
                <img src={props.imageSrc} alt={`Image preview:`} style={{ padding: 20, width: "50%", minWidth: "128px", maxWidth: "160px" }}/>
            </CardMedia>
            {(!!props.readers && props.readers.length) ? (<div>
                        <Divider inset={false}/>
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>) : null}
        </Card>
    </div>);
