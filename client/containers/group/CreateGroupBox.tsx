import * as React from "react";
import { connect } from "react-redux";

import { CreateGroupForm } from "./CreateGroupForm";

interface IComponentNameProps { };

interface IComponentNameState { };

class CreateGroupBox extends React.Component<IComponentNameProps, IComponentNameState> {
    public render(): JSX.Element {
        return (
            <div>
                <CreateGroupForm {...this.props} />
            </div>
        );
    }
}

export default connect()(CreateGroupBox);
