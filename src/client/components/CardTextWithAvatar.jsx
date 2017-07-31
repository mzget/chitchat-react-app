import * as React from "react";
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardText } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
import { xsmall_body_width, medium_body_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
export const CardTextWithAvatar = (props) => (<div style={{ padding: 2, color: grey400, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_body_width : xsmall_body_width }}>
            <CardHeader textStyle={{ padding: 0 }} title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </CardText>
            {(!!props.readers && props.readers.length) ? (<div>
                        <Divider inset={false}/>
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>) : null}
        </Card>
    </div>);
