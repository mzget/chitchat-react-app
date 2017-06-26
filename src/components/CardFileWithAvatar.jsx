import * as React from "react";
import Flexbox from "flexbox-react";
import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { grey400, darkBlack } from "material-ui/styles/colors";
export const CardFileWithAvatar = (props) => (<div style={{ padding: 2, color: grey400 }}>
        <Card>
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