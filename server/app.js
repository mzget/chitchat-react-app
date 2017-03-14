"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let express = require("express");
let path = require("path");
let favicon = require("serve-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
const useragent = require("express-useragent");
const jwt = require("jsonwebtoken");
process.env.NODE_ENV = `development`;
const app = express();
if (app.get("env") == "development") {
    process.env.PORT = 9000;
}
else if (app.get("env") == "production") {
    process.env.PORT = 9000;
}
console.log("listen on ", process.env.PORT);
const config_1 = require("./config");
const Constant = require("./scripts/Constant");
const DbClient_1 = require("./scripts/DbClient");
DbClient_1.InitDatabaseConnection().then(() => {
    DbClient_1.getAppDb().stats().then(value => {
        console.log("DB stat: ", value);
    });
}).catch(err => {
    console.error("InitDatabaseConnection Fail:" + err);
});
const index = require("./routes/index");
const users = require("./routes/users");
const authen = require("./routes/authen");
const team = require("./routes/team");
const chatroom = require("./routes/chatroom");
const group = require("./routes/group/group");
const orgChart = require("./routes/orgChart/orgChart");
const chat_upload = require("./routes/upload/uploadFile");
const stalk_user = require("./routes/stalk/user");
const apiRouteMiddleWare = express.Router();
apiRouteMiddleWare.use(function (req, res, next) {
    let apikey = req.headers[Constant.X_API_KEY];
    let deviceInfo = req.headers[Constant.X_DEVICE_INFO];
    let geoIp = req.headers[Constant.X_GEOIP];
    // check header or url parameters or post parameters for token
    let token = (!!req.headers[Constant.X_ACCESS_TOKEN]) ? req.headers[Constant.X_ACCESS_TOKEN] : req.body.token || req.query.token;
    if (req.url == "/authenticate" || req.url == "/authenticate/verify") {
        next();
    }
    else if (apikey == config_1.Config.apikey) {
        next();
    }
    else {
        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, config_1.Config.token.secret, function (err, decoded) {
                if (err) {
                    return res.status(500).json({ success: false, message: "Failed to authenticate token." + err });
                }
                else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            // if there is no token
            // return an error
            return res.status(403).json({
                success: false,
                message: "No token provided."
            });
        }
    }
});
app.use(cors());
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("../build"));
app.use(useragent.express());
app.use("/", index);
app.use("/api", apiRouteMiddleWare);
app.use("/api/auth", authen);
app.use("/api/users", users);
app.use("/api/team", team);
app.use("/api/group", group);
app.use("/api/orgChart", orgChart);
app.use("/api/chatroom", chatroom);
app.use("/chats/upload", chat_upload);
app.use("/api/stalk/user", stalk_user);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") == "development" ? err : {};
    // render the error page
    res.status(err.status || 500).json(err);
});
module.exports = app;
