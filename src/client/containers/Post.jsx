import * as React from "react";
import Flexbox from "flexbox-react";
import Subheader from "material-ui/Subheader";
import * as Colors from "material-ui/styles/colors";
export class Post extends React.Component {
    constructor() {
        super(...arguments);
        this.headerHeight = 56;
        this.footerHeight = 24;
    }
    render() {
        return (<div style={{ overflow: "hidden" }}>
                <div id={"app_body"} style={{ backgroundColor: Colors.indigo50 }}>
                    <Subheader>Feeds</Subheader>
                </div>
                <div id={"app_footer"} style={{
            height: this.footerHeight,
            fontSize: 16, textAlign: "center", backgroundColor: Colors.indigo50
        }}>
                    <Flexbox alignItems="center" justifyContent="center">
                        <span>Powered by Stalk realtime communication API.</span>
                    </Flexbox>
                </div>
            </div>);
    }
}
