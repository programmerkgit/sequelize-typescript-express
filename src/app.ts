import {authRouter} from "./app/routes/auth";
import {ErrorRequestHandler, RequestHandler} from "express";
import {sessionStoreOption, sessionConfig} from "./session_store/config";
import {passport} from "./passport";
import {userRouter} from "./app/routes/user";
import {corsOptions} from "./config";

const session = require("express-session");
const MysqlStore = require("express-mysql-session")(session);
const sessionStore = new MysqlStore(sessionStoreOption);
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const n = 10;
console.dir(n)
// @ts-ignore
export const app = express();
const cors = require("cors");
/*  logger */
app.use(logger("dev"));
/* parser */
app.use(express.urlencoded({extended: false}));
app.use(express.json());

/* view engines */
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");

/* static files */
app.use(sassMiddleware({
    src: path.join(__dirname, "../public"),
    dest: path.join(__dirname, "../public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, "../public")));

/* authentication */
app.use(cors(corsOptions));
/* session */
app.use(session({
    ...sessionConfig,
    store: sessionStore
}));

/* setting of passport */
app.use(passport.initialize());
app.use(passport.session());


/* applications */
app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/test", <RequestHandler>((req, res, next) => {
    console.log("test", "reloaded");
    res.json({test: true});
}));

// catch 404 and forward to error handler
app.use(<RequestHandler>function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(<ErrorRequestHandler>function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    console.log(err);
    res.status(err.status || 500);
    res.render("error");
});

