import * as React from "react";
import { connect } from "react-redux";

import SimpleToolbar from '../../components/Toolbar';
import AdminBox from './AdminBox';

interface IComponentNameProps {};

interface IComponentNameState {
    menu: string[];
};

class Admin extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            menu: ["create-org-group", "create-projectbase-group", "create-group"]
        }
    }

    onAdminMenuSelected(key: string) {
        console.log('onAdminMenuSelected', key);


    }

    public render(): JSX.Element {
        return (
            <span>
                <SimpleToolbar title={'Admin'} />
                <AdminBox itemName={this.state.menu} onSelectItem={this.onAdminMenuSelected} />
            </span>
        );
    }
}

const mapstateToProps = (state) => {
    return { ...state };
}
export default connect(mapstateToProps)(Admin);
