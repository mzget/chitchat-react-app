import * as React from "react";
import Flexbox from "flexbox-react";
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { darkBlack, indigo900 } from "material-ui/styles/colors";
import { small_card_width, medium_card_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
export const CardFileWithAvatar = (props) => (<Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_card_width : small_card_width, margin: 4, backgroundColor: props.bg_color }}>
        <CardHeader title={props.title} subtitle={props.subtitle} avatar={props.avatar}/>
        <Flexbox flexDirection={"row"}>
            {props.fileIcon}
            <p style={{ color: darkBlack, marginLeft: 15, fontSize: 16 }}>{props.cardText}</p>
        </Flexbox>
        <Divider inset={false}/>
        <CardActions>
            <FlatButton label="Open" primary={true} onClick={props.openAction}/>
        </CardActions>
        {(!!props.readers && props.readers.length) ? (<div>
                    <Divider inset={false}/>
                    <p style={{ paddingLeft: 10, fontFamily: "Roboto", fontSize: 12, color: indigo900 }} onClick={props.onClickReader}>{props.readers}</p>
                </div>) : null}
    </Card>);
