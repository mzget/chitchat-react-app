import * as React from "react";
import { connect } from "react-redux";

import SimpleToolbar from '../components/SimpleToolbar';
import AdminBox from './admins/AdminBox';

interface IComponentNameProps { };

interface IComponentNameState {

};

class Admin extends React.Component<IComponentNameProps, IComponentNameState> {
    menus = ["create-org-group", "create-projectbase-group", "create-group"];

    componentWillMount() {

    }

    onAdminMenuSelected(key: string) {
        console.log('onAdminMenuSelected', key);

        
    }

    public render(): JSX.Element {
        return (
            <span>
                <SimpleToolbar title={'Admin'} />
                <AdminBox itemName={this.menus} onSelectItem={this.onAdminMenuSelected} />
            </span>
        );
    }
}

const mapstateToProps = (state) => {
    return { ...state };
}
export default connect(mapstateToProps)(Admin);
