"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var mime_types_1 = require("mime-types");
var fs = require("fs");
var RequestMethods = [
    "get",
    "post",
    "put",
    "delete",
    "head",
    "connect",
    "options",
    "trace",
    "patch",
];
var Validate = function (handlers) {
    var validateResponseCallback = function (req, res) {
        var _handlers = __assign({}, handlers);
        var vResponse = __assign(__assign({}, res), { sendStatus: function (code, message) {
                if (message === void 0) { message = ""; }
                res.status(code).send(message);
            }, sendFile: function (url) {
                if (url === void 0) { url = ""; }
                try {
                    var fileHeadType = mime_types_1.lookup(url);
                    if (typeof fileHeadType === "string") {
                        res.writeHead(200, {
                            "Content-Type": fileHeadType.toString()
                        });
                        var rs = fs.createReadStream(url);
                        rs.pipe(res);
                    }
                    else {
                        res.status(404).send("File not found");
                    }
                }
                catch (err) {
                    throw err;
                }
            } });
        try {
            RequestMethods.forEach(function (requestMethod) {
                if (!handlers[requestMethod]) {
                    var invalidMethodCb = function (req, res) {
                        res
                            .status(405)
                            .send("Cannot " + requestMethod.toUpperCase() + " " + req.url);
                    };
                    _handlers[requestMethod] = invalidMethodCb;
                }
            });
            return _handlers[req.method.toLowerCase()](req, vResponse);
        }
        catch (err) {
            res.send("An error ocurred");
            throw err;
        }
    };
    return validateResponseCallback;
};
RequestMethods.forEach(function (requestMethod) {
    Validate[requestMethod] = function (handler) {
        var responseCb = function (req, res) {
            var method = req.method;
            var vResponse = __assign(__assign({}, res), { sendStatus: function (code, message) {
                    if (message === void 0) { message = ""; }
                    res.status(code).send(message);
                }, sendFile: function (url) {
                    if (url === void 0) { url = ""; }
                    try {
                        var fileHeadType = mime_types_1.lookup(url);
                        if (typeof fileHeadType === "string") {
                            res.writeHead(200, {
                                "Content-Type": fileHeadType.toString()
                            });
                            var rs = fs.createReadStream(url);
                            rs.pipe(res);
                        }
                        else {
                            res.status(404).send("File not found");
                        }
                    }
                    catch (err) {
                        throw err;
                    }
                } });
            if (method.toLowerCase() === requestMethod) {
                handler(req, vResponse);
            }
            else {
                vResponse.sendStatus(405, "Cannot " + method + " " + req.url);
            }
        };
        return responseCb;
    };
});
exports["default"] = Validate;
