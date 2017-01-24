import * as React from "react";
import Subheader from 'material-ui/Subheader';

import { IComponentProps } from "../../utils/IComponentProps";

import * as userRx from "../../redux/user/userRx";
import * as teamRx from "../../redux/team/teamRx";
import * as chatroomActions from "../../redux/chatroom/chatroomActions";
import * as chatroomRx from "../../redux/chatroom/chatroomRxEpic";
import * as groupRx from "../../redux/group/groupRx";

import { GroupList } from "./GroupList";

interface IComponentNameState { };

class OrgGroupListBox extends React.Component<IComponentProps, IComponentNameState> {

    componentWillMount() {
        console.log("GroupList", this.props);

        this.onselectGroup = this.onselectGroup.bind(this);

        this.props.dispatch(groupRx.getOrgGroup(this.props.teamReducer.team._id));
    }


    componentWillReceiveProps(nextProps: IComponentProps) {
        let {chatroomReducer, teamReducer, userReducer} = nextProps;

        switch (chatroomReducer.state) {
            case chatroomActions.GET_PERSISTEND_CHATROOM_FAILURE: {
                //     this.props.dispatch(WTF);
                break;
            }
            default:
                break;
        }
    }

    onselectGroup(data) {
        this.props.dispatch(chatroomActions.getPersistendChatroom(data._id));
    }

    public render(): JSX.Element {
        return (
            <div>
                <Subheader>Org-Group</Subheader>
                <GroupList values={this.props.groupReducer.orgGroups} onSelected={this.onselectGroup} />
            </div>);
    }
}

export default OrgGroupListBox;
