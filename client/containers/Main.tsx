import * as React from "react";
import { connect } from "react-redux";

import { IComponentProps } from '../utils/IComponentProps';

import SimpleToolbar from '../components/SimpleToolbar';
import ChatLogsBox from "./ChatLogsBox";
import ChatListBox from './chatlist/ChatListBox';

import * as authRx from "../redux/authen/authRx";

interface IComponentNameState {
    toolbar: string;
};

class Main extends React.Component<IComponentProps, IComponentNameState> {
    
    menus = ["admin", "log out"];

    componentWillMount() {
        this.state = {
            toolbar: 'Home'
        }

        this.onSelectMenuItem = this.onSelectMenuItem.bind(this);
    }

    componentWillReceiveProps(nextProps: IComponentProps) {
        let { userReducer } = nextProps;

        switch (userReducer.state) {

            default:
                if (!userReducer.user) {
                    this.props.router.push('/');
                }
                break;
        }
    }

    onSelectMenuItem(id, value) {
        console.log(this.menus[id]);

        let {authReducer} = this.props;
        switch (id) {
            case 0:
                this.props.router.push(`/admin/${authReducer.user}`);
                break;
            case 1:
                this.props.dispatch(authRx.logout(this.props.authReducer.token));
                break;
            default:
                break;
        }
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
