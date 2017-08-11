import * as React from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { SvgIcon, RaisedButton } from 'material-ui';
import GoogleLogo from '../assets/icons/GoogleLogo';
import FacebookLogo from '../assets/icons/FacebookLogo';
import LineLogo from '../assets/icons/LineLogo';
const facebookInfo = {
    appID: "Your App Id",
    permission: "name,email,picture"
};
const googleInfo = {
    clientId: "Your Client Id",
};
const Button = (props) => (<RaisedButton buttonStyle={props.buttonStyle} icon={<SvgIcon {...props.svgIconProps}>{props.icon}</SvgIcon>} labelStyle={props.labelStyle} label={props.label}/>);
const Google = (props) => {
    return (<GoogleLogin style={STYLE.google} tag="div" clientId={googleInfo.clientId} onSuccess={(res) => { props.onSocialLogin('google', res); }} onFailure={(err) => { console.warn('onGoogleFailure', err); }}>
            <Button buttonStyle={{ width: '225px' }} label={props.label} icon={<GoogleLogo />}/>
        </GoogleLogin>);
};
const Facebook = (props) => {
    return (<FacebookLogin appId={facebookInfo.appID} fields={facebookInfo.permission} buttonStyle={STYLE.facebook} textButton="" tag="div" icon={<Button buttonStyle={{ backgroundColor: '#4267b2' }} labelStyle={{ color: '#fff' }} label={props.label} icon={<FacebookLogo />}/>} callback={(res) => { props.onSocialLogin('facebook', res); }}/>);
};
const Line = (props) => {
    return (<Button buttonStyle={{ width: '225px', backgroundColor: '#00C300' }} labelStyle={{ color: '#fff' }} label={props.label} icon={<LineLogo />} svgIconProps={{ viewBox: '0 0 35 35', style: { width: '35px', height: '35px' } }}/>);
};
const STYLE = {
    google: {
        padding: 0,
        width: 'initial',
        display: 'inline-block'
    },
    facebook: {
        padding: 0,
        background: 'transparent',
        border: 'none',
        width: '225px'
    },
    line: {
        padding: 0,
        width: 'initial',
        display: 'inline-block'
    },
};
export { Google, Facebook, Line };
