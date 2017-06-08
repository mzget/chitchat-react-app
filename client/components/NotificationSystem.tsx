import * as React from 'react';
import NotificationsSystem from 'reapop';
// 1. import theme
import * as theme from 'reapop-theme-wybo';
// 
export class ReapopComponent extends React.Component<any, any> {
    render() {
        // 2. set `theme` prop
        return (
            <div>
                <NotificationsSystem theme={theme} />
            </div>
        );
    }
}