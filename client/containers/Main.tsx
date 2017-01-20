import * as React from "react";
import { connect } from "react-redux";

import SimpleToolbar from '../components/Toolbar';
import ChatLogsBox from "./ChatLogsBox";

interface IComponentNameProps { };

interface IComponentNameState {
    toolbar: string;
};

class Main extends React.Component<IComponentNameProps, IComponentNameState> {
    componentWillMount() {
        this.state = {
            toolbar: 'Home'
        }
    }
    public render(): JSX.Element {
        return (
            <div>
                <SimpleToolbar title={this.state.toolbar} />
                <ChatLogsBox {...this.props} />
            </div>);
    }
}


const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Main);
