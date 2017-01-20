import * as React from "react";
import { connect } from "react-redux";

import ChatLogsBox from "./ChatLogsBox";

interface IComponentNameProps { };

interface IComponentNameState { };

class Main extends React.Component<IComponentNameProps, IComponentNameState> {
    public render(): JSX.Element {
        return (
            <div>

            <ChatLogsBox {...this.props} />
        </div>);
    }
}


const mapStateToProps = (state) => ({ ...state });
export default connect(mapStateToProps)(Main);
