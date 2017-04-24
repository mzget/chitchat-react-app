import * as React from "react";
import { connect } from "react-redux";
import { pure, ComponentEnhancer } from "recompose";

import { GroupMember } from "./GroupMember";

import { ChitChatAccount } from "../../chitchat/chats/models/User";
interface IEnhanceProps {
    members: Array<any>;
}
export const GroupMemberEnhancer = pure(({ members }: IEnhanceProps) =>
    <GroupMember members={members} />
);