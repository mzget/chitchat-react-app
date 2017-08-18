import * as React from "react";
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardText } from "material-ui/Card";
import * as Colors from "material-ui/styles/colors";
import { small_card_width, medium_card_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
export const CardTextWithAvatar = (props) => (<Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_card_width : small_card_width, margin: 4, backgroundColor: props.bg_color }}>
        <CardHeader textStyle={{ padding: 0 }} title={props.title} subtitle={props.subtitle} avatar={props.avatar}/>
        <CardText style={{ color: Colors.darkBlack, marginLeft: 15 }}>
            {props.cardText}
        </CardText>
        {(!!props.readers && props.readers.length) ? (<div>
                    <Divider inset={false}/>
                    <p style={{ paddingLeft: 10, fontFamily: "Roboto", fontSize: 12, color: Colors.indigo900 }} onClick={props.onClickReader}>{props.readers}</p>
                </div>) : null}
    </Card>);
