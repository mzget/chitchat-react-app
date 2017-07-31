import * as React from "react";
import Flexbox from "flexbox-react";
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { grey400, darkBlack } from "material-ui/styles/colors";
import { xsmall_body_width, medium_body_width, LARGE_TABLET } from '../chitchat/consts/Breakpoints';
export const CardFileWithAvatar = (props) => (<div style={{ padding: 2, color: grey400, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_body_width : xsmall_body_width }}>
            <CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
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
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>) : null}
        </Card>
    </div>);
