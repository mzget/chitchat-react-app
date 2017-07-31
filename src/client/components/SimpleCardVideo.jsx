import * as React from 'react';
import { Card, CardMedia } from 'material-ui/Card';
const SimpleCardVideo = (props) => (<Card>
        <CardMedia>
            <video preload='metadata'>
                <source src={props.src}/>
                Sorry; your browser doesn't support HTML5 video.
            </video>
        </CardMedia>
    </Card>);
export default SimpleCardVideo;
