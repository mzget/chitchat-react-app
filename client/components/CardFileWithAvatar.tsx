import * as React from "react";
import { Flex, Box } from "reflexbox";
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { grey400, darkBlack, lightBlack } from "material-ui/styles/colors";

interface MyProps {
    title: string;
    subtitle: string;
    avatar: any;
    cardText?: string;
    imageSrc: string;
    openAction: () => void;
}
export const CardFileWithAvatar = (props: MyProps) => (
    <div style={{ padding: 2, color: grey400 }}>
        <Card>
            <CardHeader
                title={<span style={{ color: "blue" }}>{props.title}</span>}
                subtitle={<span>{props.subtitle}</span>}
                avatar={props.avatar}
            />
            <Flex flexColumn={false}>
                <img src={props.imageSrc} style={{ padding: 5 }} alt={`Image preview: ${props.cardText}`} />
                <p style={{ color: lightBlack, marginLeft: 15 }}>{props.cardText}</p>
            </Flex>
            <CardActions>
                <FlatButton label="Open" primary={true} onClick={props.openAction} />
            </CardActions>
        </Card>
    </div>
);