import * as React from "react";
import Flexbox from "flexbox-react";
export const ChitChatFooter = () => (<Flexbox width="100%" alignContent="center" alignItems="center">
        <span style={{ width: 10 }}/>
        <a href="https://github.com/mzget/chitchat-react-app/wiki#app" style={{ fontFamily: "Roboto", fontSize: 12 }}>Download app</a>
        <span style={{ width: 10 }}/>
        <a href="https://github.com/mzget/chitchat-react-app/wiki#app" style={{ fontFamily: "Roboto", fontSize: 12 }}>Guides</a>
        <span style={{ width: 10 }}/>
        <a href="https://github.com/mzget/chitchat-react-app/wiki" style={{ fontFamily: "Roboto", fontSize: 12 }}>Developer</a>
        <Flexbox flexGrow={1}/>
        <p style={{ fontFamily: "Roboto", fontSize: 12 }}>Powered by S-Talk Communication API.</p>
        <span style={{ width: 10 }}/>
        <p style={{ fontFamily: "Roboto", fontSize: 12, marginRight: 10 }}>Copyright (c)2017 AhooStudio.co.th</p>
    </Flexbox>);
