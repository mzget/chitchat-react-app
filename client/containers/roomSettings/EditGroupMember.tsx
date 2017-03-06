import * as React from "react";
import { withProps, withState, compose, flattenProp } from "recompose";

import { MemberList } from "../chatlist/MemberList";

const enhance = compose(
    withProps({}),
    flattenProp("members")
);

export const EditGroupMember = enhance(({ members }) =>
    <MemberList
        onSelected={null}
        value={members}
        rightToggle={true}
        onToggleItem={(item, checked) => {

            console.log(item, checked);
        }}
    />
);