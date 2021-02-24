import { NextApiRequest, NextApiResponse } from "next";
import { lookup } from "mime-types";
import * as fs from "fs";
interface ValidateRequest extends NextApiRequest {}

interface ValidateResponse<T> extends NextApiResponse {
  sendStatus?: (code: number, message?: string) => void;
  sendFile?: (url?: string) => void;
}
/** Request handler */
type RequestValidatorHandlerType = (
  /** Request object */
  Req: ValidateRequest,
  /** Response object */
  Res: ValidateResponse<any>
) => void;

type SingleHandler = (
  /** Handle only requests using one request method */
  Req: RequestValidatorHandlerType
) => void;

interface IValidator {
  /** Handles a GET request */
  get?: SingleHandler;
  /** Handles a POST request */
  post?: SingleHandler;
  /** Handles a PUT request */
  put?: SingleHandler;
  /** Handles a DELETE request */
  delete?: SingleHandler;
  /** Handles a HEAD request */
  head?: SingleHandler;
  /** Handles a CONNECT request */
  connect?: SingleHandler;
  /** Handles an OPTIONS request */
  options?: SingleHandler;
  /** Handles a TRACE request */
  trace?: SingleHandler;
  /** Handles a PATCH request */
  patch?: SingleHandler;
}

interface IValidatorProps {
  /** Handles a GET request */
  get?: RequestValidatorHandlerType;
  /** Handles a POST request */
  post?: RequestValidatorHandlerType;
  /** Handles a PUT request */
  put?: RequestValidatorHandlerType;
  /** Handles a DELETE request */
  delete?: RequestValidatorHandlerType;
  /** Handles a HEAD request */
  head?: RequestValidatorHandlerType;
  /** Handles a CONNECT request */
  connect?: RequestValidatorHandlerType;
  /** Handles an OPTIONS request */
  options?: RequestValidatorHandlerType;
  /** Handles a TRACE request */
  trace?: RequestValidatorHandlerType;
  /** Handles a PATCH request */
  patch?: RequestValidatorHandlerType;
}

/** Specify callbacks for different methods made to an endpoint */
type ValidateType = (handlers: IValidatorProps) => Function;
interface IValidate extends IValidatorProps, ValidateType {}
const RequestMethods = [
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

const Validate: IValidate = (handlers: IValidatorProps) => {
  const validateResponseCallback: RequestValidatorHandlerType = function (
    req,
    res
  ) {
    const _handlers = { ...handlers };
    const vResponse = {
      ...res,
      sendStatus: (code, message = "") => {
        res.status(code).send(message);
      },
      sendFile: (url = "") => {
        try {
          const fileHeadType = lookup(url);
          if (typeof fileHeadType === "string") {
            res.writeHead(200, {
              "Content-Type": fileHeadType.toString(),
            });
            const rs = fs.createReadStream(url);
            rs.pipe(res);
          } else {
            res.status(404).send("File not found");
          }
        } catch (err) {
          throw err;
        }
      },
    } as ValidateResponse<any>;
    try {
      RequestMethods.forEach((requestMethod: string) => {
        if (!handlers[requestMethod]) {
          const invalidMethodCb: RequestValidatorHandlerType = (req, res) => {
            res
              .status(405)
              .send(`Cannot ${requestMethod.toUpperCase()} ${req.url}`);
          };
          _handlers[requestMethod] = invalidMethodCb;
        }
      });
      return _handlers[req.method.toLowerCase()](req, vResponse);
    } catch (err) {
      res.send("An error ocurred");
      throw err;
    }
  };
  return validateResponseCallback;
};
RequestMethods.forEach((requestMethod) => {
  Validate[requestMethod] = (handler: RequestValidatorHandlerType) => {
    const responseCb: RequestValidatorHandlerType = (req, res) => {
      const { method } = req;
      const vResponse = {
        ...res,
        sendStatus: (code, message = "") => {
          res.status(code).send(message);
        },
        sendFile: (url = "") => {
          try {
            const fileHeadType = lookup(url);
            if (typeof fileHeadType === "string") {
              res.writeHead(200, {
                "Content-Type": fileHeadType.toString(),
              });
              const rs = fs.createReadStream(url);
              rs.pipe(res);
            } else {
              res.status(404).send("File not found");
            }
          } catch (err) {
            throw err;
          }
        },
      } as ValidateResponse<any>;
      if (method.toLowerCase() === requestMethod) {
        handler(req, vResponse);
      } else {
        vResponse.sendStatus(405, `Cannot ${method} ${req.url}`);
      }
    };
    return responseCb;
  };
});

export default Validate;
