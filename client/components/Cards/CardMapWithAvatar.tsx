import * as React from "react";
import Flexbox from "flexbox-react";

import Divider from 'material-ui/Divider';
import { Card, CardActions, CardHeader, CardMedia, CardTitle } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

import { SimpleMapPreview } from "../Maps/SimpleMapPreview";

import { xsmall_body_width, medium_body_width, LARGE_TABLET } from '../../chitchat/consts/Breakpoints';

interface ICompProps {
    title: string;
    subtitle: string;
    avatar: any;
    content: any;
    readers: string;
    onClickReader: () => void;
}

export const CardMapWithAvatar = (props: ICompProps) => (
    <div style={{ padding: 2, color: grey400, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: window.innerWidth >= LARGE_TABLET ? medium_body_width : xsmall_body_width }}>
            <CardHeader
                title={<span style={{ color: "blue" }}>{props.title}</span>}
                subtitle={<span>{props.subtitle}</span>}
                avatar={props.avatar}
            />
            <Flexbox flexDirection="row" justifyContent="center">
                <SimpleMapPreview marker={props.content} />
            </Flexbox>
            <Divider inset={false} />
            {
                (!!props.readers && props.readers.length) ? (
                    <div>
                        <Divider inset={false} />
                        <a style={{ padding: 5 }} onClick={props.onClickReader}>{props.readers}</a>
                    </div>
                ) : null
            }
        </Card>
    </div>
);