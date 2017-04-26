import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { pure, ComponentEnhancer } from "recompose";

import { EditGroupMember, EditGroupMemberEnhancer } from "./EditGroupMember";
import { GroupMember } from "./GroupMember";

import { ChitChatAccount } from "../../chitchat/chats/models/User";
interface IEnhanceProps {
    members: Array<any>;
}