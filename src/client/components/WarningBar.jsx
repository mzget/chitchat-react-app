import * as React from "react";
import Flexbox from 'flexbox-react';
import * as Colors from "material-ui/styles/colors";
export const WarningBar = () => (<div id={"warning_bar"}>
        <Flexbox style={{ backgroundColor: Colors.red500 }} flexGrow={1} alignItems="center" justifyContent="center">
            <Flexbox flexDirection="column">
                <span style={{ color: Colors.white, fontSize: 14 }}>Unable to connect with chat service.</span>
                <span style={{ color: Colors.white, fontSize: 14 }}>Check your Internet connection.</span>
            </Flexbox>
        </Flexbox>
    </div>);
