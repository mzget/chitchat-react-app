import * as  React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withProps, withState, withHandlers, compose, lifecycle, shallowEqual, ComponentEnhancer } from "recompose";

import { ChitChatAccount } from "../../chitchat/chats/models/User";

import { IAddMembersProps } from "../roomSettings/AddMembers";

import { suggestUser } from "../../redux/user/userRx";
import { addGroupMember } from "../../redux/group/editGroupRxActions";
import * as chatroomActions from "../../chitchat/chats/redux/chatroom/chatroomActions";

const mapStateToProps = (state) => ({ userReducer: state.userReducer });
export const AddMemberEnhancer = compose(
    connect(mapStateToProps),
    withState("search", "setSearch", ""),
    withState("members", "setMembers", []),
    lifecycle({
        componentWillReceiveProps(nextProps) {
            let { searchUsers } = nextProps.userReducer;
            let { match: { params } } = nextProps;

            if (!shallowEqual(searchUsers, this.props.userReducer.searchUsers)) {
                if (Array.isArray(searchUsers)) {
                    let room = chatroomActions.getRoom(params.room_id);
                    let _members = searchUsers.filter(v => {
                        let _has = room.members.some(member => {
                            if (member._id == v._id) {
                                return true;
                            }
                        });

                        if (!_has) {
                            return v;
                        }
                    });
                    this.props.setMembers(members => _members);
                }
            }
        }
    }),
    withHandlers({
        onSearch: (props: IAddMembersProps) => () => {
            props.dispatch(suggestUser(props.search, null));
        },
        onAddMember: (props: IAddMembersProps) => item => {
            props.dispatch(addGroupMember(props.match.params.room_id, item));
        },
        onTextChanged: (props: IAddMembersProps) => (e, value: string) => {
            props.setSearch(search => value);
        }
    })
);