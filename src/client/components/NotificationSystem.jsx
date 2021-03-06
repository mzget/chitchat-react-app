import * as React from 'react';
import { connect } from "react-redux";
import NotificationsSystem from 'reapop';
import * as theme from 'reapop-theme-wybo';
import { addNotification } from 'reapop';
class ReapopComponent extends React.Component {
    componentWillReceiveProps(nextProps) {
        let { stalkReducer } = nextProps;
        if (stalkReducer.notiMessage != this.props.stalkReducer.notiMessage) {
            this.props.dispatch(addNotification({
                title: stalkReducer.notiMessage.title,
                message: stalkReducer.notiMessage.body,
                image: stalkReducer.notiMessage.image,
                dismissible: true,
                dismissAfter: 3000
            }));
        }
    }
    render() {
        return (<div>
                <NotificationsSystem theme={theme}/>
            </div>);
    }
}
const mapStateToProps = (state) => ({
    notifications: state.notifications,
    stalkReducer: state.stalkReducer
});
export const ReapopNotiBoxWithState = connect(mapStateToProps)(ReapopComponent);
