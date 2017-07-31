import * as React from 'react';
import { Card, CardMedia } from 'material-ui/Card';
const SimpleCardImage = (props) => (<Card>
        <CardMedia>
            <img src={props.src} width='100%' alt="Image preview..."/>
        </CardMedia>
    </Card>);
export default SimpleCardImage;
