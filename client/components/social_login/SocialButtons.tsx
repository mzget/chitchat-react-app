import * as React from 'react';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { SvgIcon, RaisedButton } from 'material-ui';

import GoogleLogo from './icons/GoogleLogo';
import FacebookLogo from './icons/FacebookLogo';
import LineLogo from './icons/LineLogo';

const facebookInfo = {
    appID: "1825382087777683",
    permission: "name,email,picture,first_name,last_name"
}

const googleInfo = {
    clientId: "Your Client Id",
}

const Button = (props) => (
    <RaisedButton
        buttonStyle={props.buttonStyle}
        icon={<SvgIcon {...props.svgIconProps}>{props.icon}</SvgIcon>}
        labelStyle={props.labelStyle}
        label={props.label} />
);

const Google = (props) => {
    return (
        <GoogleLogin
            style={STYLE.google}
            tag="div"
            clientId={googleInfo.clientId}
            onSuccess={(res) => { props.onSocialLogin('google', res) }}
            onFailure={(err) => { console.warn('onGoogleFailure', err); }} >
            <Button buttonStyle={{ width: '225px' }} label={props.label} icon={<GoogleLogo />} />
        </GoogleLogin>
    );
};

const Facebook = (props: { onSocialLogin, onClicked, label?}) => {
    return (
        <FacebookLogin
            appId={facebookInfo.appID}
            fields={facebookInfo.permission}
            buttonStyle={STYLE.facebook}
            textButton=""
            tag="div"
            icon={<Button
                buttonStyle={{ backgroundColor: '#4267b2' }}
                labelStyle={{ color: '#fff' }}
                label={props.label}
                icon={<FacebookLogo />} />}
            onClick={props.onClicked}
            callback={props.onSocialLogin} />
    );
}

const Line = (props) => {
    // return (
    //     <GoogleLogin
    //         style={STYLE.line}
    //         tag="div"
    //         clientId={googleInfo.clientId}
    //         onSuccess={(res) => { props.onSocialLogin('google', res) }}
    //         onFailure={(err) => { console.warn('onGoogleFailure', err); }} >
    //         <Button
    //             buttonStyle={{ width: '225px', backgroundColor: '#00C300' }}
    //             labelStyle={{ color: '#fff' }}
    //             label={props.label}
    //             icon={<LineLogo />}
    //             svgIconProps={{ viewBox: '0 0 35 35', style: { width: '35px', height: '35px' } }} />
    //     </GoogleLogin>
    // );
    return (
        <Button
            buttonStyle={{ width: '225px', backgroundColor: '#00C300' }}
            labelStyle={{ color: '#fff' }}
            label={props.label}
            icon={<LineLogo />}
            svgIconProps={{ viewBox: '0 0 35 35', style: { width: '35px', height: '35px' } }} />
    );
};

const STYLE = {
    google: {
        padding: 0,
        width: '100%',
        display: 'inline-block'
    },
    facebook: {
        padding: 0,
        background: 'transparent',
        border: 'none',
        width: '100%'
    },
    line: {
        padding: 0,
        width: 'initial',
        display: 'inline-block'
    },
}

export { Google, Facebook, Line };