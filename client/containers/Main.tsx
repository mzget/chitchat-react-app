import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from '../utils/IComponentProps';

import SimpleToolbar from '../components/SimpleToolbar';
import ChatLogsBox from "./ChatLogsBox";

interface IComponentNameState {
    toolbar: string;
};

class Main extends React.Component<IComponentProps, IComponentNameState> {
    
    menus = ["admin"];

    componentWillMount() {
        this.state = {
            toolbar: 'Home'
        }

        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }

    onSelectMenuItem(id, value) {
        console.log(this.menus[id]);

        let {authReducer} = this.props;

        this.props.router.push(`/admin/${authReducer.user}`);
    }

    public render(): JSX.Element {
        return (
            <div>
                <SimpleToolbar title={this.state.toolbar} menus={this.menus} onSelectedMenuItem={this.onSelectMenuItem} />
                <ChatLogsBox {...this.props} />
            </div>);
    }
}


const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Main);
