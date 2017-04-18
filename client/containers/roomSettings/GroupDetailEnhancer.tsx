import * as React from "react";
import { connect } from "react-redux";
import * as Immutable from "immutable";
import { withProps, withState, withHandlers, compose, lifecycle, shallowEqual } from "recompose";
import { GroupDetail } from "./GroupDetail";
import * as editGroupRxActions from "../../redux/group/editGroupRxActions";
import * as groupRx from "../../redux/group/groupRx";
import { Room } from "../../chitchat/libs/shared/Room";
import { ChitChatFactory } from "../../chitchat/chats/chitchatFactory";

const config = () => ChitChatFactory.getInstance().config;

interface IEnhanceProps {
    onSubmit: () => void;
    onError: () => void;
    onFinished: () => void;
    group?: Room;
    image?: string;
    setImageUrl;
    imageFile;
    setImageFile;
    group_name: string;
    setGroupName;
    onGroupNameChange: (e, text) => void;
    group_description?: string;
    setGroupDescription;
    onGroupDescriptionChange?: (e, text) => void;
    onFileReaderChange?: (e, result) => void;
    dispatch?;
}

const submit = (props: IEnhanceProps) => {
    console.log(props);
    let group = { ...props.group } as Room;
    group.name = props.group_name;
    group.description = props.group_description;
    group.image = props.image;
    props.dispatch(editGroupRxActions.editGroupDetail(group));
};

const enhance = compose(
    withState("group_name", "setGroupName", ({ group_name }) => group_name),
    withState("group_description", "setGroupDescription", ({ group_description }) => group_description),
    withState("image", "setImageUrl", ({ image }) => image),
    withState("imageFile", "setImageFile", null),
    lifecycle({
        componentWillReceiveProps(nextProps) {
            let { groupReducer } = nextProps;

            if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_FAILURE) {
                if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                    this.props.onError(groupReducer.error);
                }
            }
            else if (groupReducer.state == groupRx.UPLOAD_GROUP_IMAGE_SUCCESS) {
                if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                    this.props.setImageFile(prev => null);
                    this.props.setImageUrl(prev => `${config().api.host}${groupReducer.groupImageResult.path}`, () => {
                        submit(this.props);
                    });
                }
            }
            else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_FAILURE) {
                if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                    this.props.onError(groupReducer.error);
                }
            }
            else if (groupReducer.state == editGroupRxActions.EDIT_GROUP_DETAIL_SUCCESS) {
                if (!shallowEqual(this.props.groupReducer, groupReducer)) {
                    this.props.onFinished();
                }
            }
        }
    }),
    withHandlers({
        onGroupNameChange: (props: IEnhanceProps) => (e, text) => {
            props.setGroupName(groupName => text);
        }, onGroupDescriptionChange: (props: IEnhanceProps) => (e, text) => {
            props.setGroupDescription(group_description => text);
        },
        onFileReaderChange: (props: IEnhanceProps) => (e, results) => {
            results.forEach(result => {
                const [progressEvent, file] = result;

                props.setImageUrl(prev => progressEvent.target.result);
                props.setImageFile(prev => file);
            });
        },
        onSubmit: (props: IEnhanceProps) => event => {
            if (!!props.imageFile) {
                // @Todo upload group image first...
                props.dispatch(groupRx.uploadGroupImage(props.imageFile));
            }
            else {
                submit(props);
            }
        }
    })
);

const EnhanceGroupDetail = enhance(({
  group, image, group_name, group_description,
    onGroupNameChange, onGroupDescriptionChange, onFileReaderChange,
    onSubmit, onError, onFinished
 }: IEnhanceProps) =>
    <GroupDetail
        image={image}
        group_name={group_name}
        group_description={group_description}
        onSubmit={onSubmit}
        onGroupNameChange={onGroupNameChange}
        onGroupDescriptionChange={onGroupDescriptionChange}
        onFileReaderChange={onFileReaderChange}
    />);


const mapStateToProps = (state) => ({ groupReducer: state.groupReducer });
export const ConnectGroupDetail = connect(mapStateToProps)(EnhanceGroupDetail);