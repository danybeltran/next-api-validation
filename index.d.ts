import { NextApiRequest, NextApiResponse } from "next";
interface ValidateRequest extends NextApiRequest {}
interface ValidateResponse<T> extends NextApiResponse {
  sendStatus?: (code: number, message?: string) => void;
  sendFile?: (url?: string) => void;
}
/** Request handler */
declare type RequestValidatorHandlerType = (
  /** Request object */
  Req: ValidateRequest,
  /** Response object */
  Res: ValidateResponse<any>
) => void;
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
declare type ValidateType = (handlers: IValidatorProps) => Function;
interface IValidate extends IValidatorProps, ValidateType {}
declare const Validate: IValidate;
export default Validate;
