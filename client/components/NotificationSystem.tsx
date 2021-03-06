import * as React from 'react';
import { connect } from "react-redux";
import NotificationsSystem from 'reapop';
// 1. import theme
import * as theme from 'reapop-theme-wybo';

import { addNotification } from 'reapop';

class ReapopComponent extends React.Component<any, any> {
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
        // 2. set `theme` prop
        return (
            <div>
                <NotificationsSystem theme={theme} />
            </div>
        );
    }
}

/**
 * ## Redux boilerplate
 */
const mapStateToProps = (state) => ({
    notifications: state.notifications,
    stalkReducer: state.stalkReducer
});
export const ReapopNotiBoxWithState = connect(mapStateToProps)(ReapopComponent);