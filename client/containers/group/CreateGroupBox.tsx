import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from "../../utils/IComponentProps";
import { CreateGroupForm } from "./CreateGroupForm";

interface IComponentNameProps   {
    onError: (error: string) => void;
};

interface IComponentNameState {
    groupImage: string;
    groupName: string;
    groupDescription: string;
};

class CreateGroupBox extends React.Component<IComponentNameProps, IComponentNameState> {

    componentWillMount() {
        this.state = {
            groupImage: "",
            groupName: "",
            groupDescription: ""
        };

        this.onSubmitGroup = this.onSubmitGroup.bind(this);
    }

    onSubmitGroup() {
        console.log("submit group", this.state);
        if (this.state.groupName.length > 0) {

        }
        else {
            this.props.onError("Missing some require field");
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <CreateGroupForm
                    image={this.state.groupImage}
                    group_name={this.state.groupName} onGroupNameChange={(e, text) => {
                        this.setState(previous => ({ ...previous, groupName: text }));
                    }}
                    group_description={this.state.groupDescription} onGroupDescriptionChange={(e, text) => {
                        this.setState(previous => ({ ...previous, groupDescription: text }));
                    }}
                    onSubmit={this.onSubmitGroup}
                />
            </div>
        );
    }
}

export default connect()(CreateGroupBox);
