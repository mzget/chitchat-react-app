import * as React from "react";
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardText } from "material-ui/Card";
import { grey400 } from "material-ui/styles/colors";
export const CardTextWithAvatar = (props) => (<div style={{ padding: 2, color: grey400 }}>
        <Card>
            <CardHeader title={<span style={{ color: "blue" }}>{props.title}</span>} subtitle={<span>{props.subtitle}</span>} avatar={props.avatar}/>
            <CardText style={{ color: "black", marginLeft: 15 }}>
                {props.cardText}
            </CardText>
            {(!!props.readers && props.readers.length) ? (<div>
                        <Divider inset={false}/>
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>) : null}
        </Card>
    </div>);
