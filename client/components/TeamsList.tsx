import * as React from "react";
import Flexbox from "flexbox-react";
import { Paper, Card, CardTitle } from "material-ui";
import { darkWhite } from "material-ui/styles/colors";

import { MemberList } from "./MemberList";
const Styles = require("../../styles/generalStyles");
const PageBox = Styles.generalStyles.pageBox;

export const TeamsList = (props: { onSelectMember, members }) => (
    <Flexbox width="100%" justifyContent="center" style={{ backgroundColor: darkWhite }}>
        <Flexbox flexDirection="column" minWidth="400px">
            <Card>
                <CardTitle title="Team Lists" />
            </Card>
            <div style={{ overflowY: "auto" }}>
                <MemberList onSelected={props.onSelectMember} items={props.members} />
            </div>
        </Flexbox>
    </Flexbox>
);