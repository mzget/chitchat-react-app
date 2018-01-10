const validate = require("validate.js");
export function validateEmailPass(_email, _password, callback) {
    const constraints = {
        email: {
            email: true,
            presence: true
        },
        password: {
            presence: true,
            length: {
                minimum: 8,
                message: "must be at least 8 characters"
            }
        }
    };
    callback(validate({ email: _email, password: _password }, constraints));
}
export function validateEmail(_email, callback) {
    const _constraints = {
        email: {
            email: true,
            presence: true
        }
    };
    callback(validate({ email: _email }, _constraints));
}
