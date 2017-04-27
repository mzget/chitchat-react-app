import * as  React from "react";
import { connect } from "react-redux";
import { Flex, Box } from "reflexbox";
import { withProps, withState, withHandlers, compose, lifecycle, shallowEqual, ComponentEnhancer } from "recompose";

import { IAddMembersProps } from "../roomSettings/AddMembers";

import { suggestUser } from "../../redux/user/userRx";

const mapStateToProps = (state) => ({ userReducer: state.userReducer });
export const AddMemberEnhancer = compose(
    connect(mapStateToProps),
    withState("search", "setSearch", ""),
    withState("members", "setMembers", []),
    lifecycle({
        componentWillReceiveProps(nextProps) {
            let { searchUsers } = nextProps.userReducer;

            if (!shallowEqual(searchUsers, this.props.members)) {
                this.props.setMembers(members => searchUsers);
            }
        }
    }),
    withHandlers({
        onSearch: (props: IAddMembersProps) => () => {
            props.dispatch(suggestUser(props.search, null));
        },
        onAddMember: (props: IAddMembersProps) => item => {
            console.log(item);
        },
        onTextChanged: (props: IAddMembersProps) => (e, value: string) => {
            props.setSearch(search => value);
        }
    })
);