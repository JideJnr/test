export const roleChecker = (
  allowedRoles?: string[],
  role?: string
): boolean => {
  const isAccessible: boolean =
    allowedRoles?.length === 0
      ? true
      : allowedRoles?.length > 0 && !!allowedRoles?.includes(role);

  return !!isAccessible;
};

export function handleHttpError(error) {
  if (!error.response) {
    return { message: "No response from server", status: 0 };
  }

  const status: number = error.response.status;
  let customMessage: string = "An unexpected error occurred";
  let errorType = "GeneralError";

  switch (status) {
    case 400:
      customMessage = "Bad Request";
      errorType = "ClientError";
      break;
    case 401:
      customMessage = "Unauthorized";
      errorType = "ClientError";
      break;
    case 402:
      customMessage = "Payment Required";
      errorType = "ClientError";
      break;
    case 403:
      customMessage = "Forbidden";
      errorType = "ClientError";
      break;
    case 404:
      customMessage = "Not Found";
      errorType = "ClientError";
      break;
    case 405:
      customMessage = "Method Not Allowed";
      errorType = "ClientError";
      break;
    case 406:
      customMessage = "Not Acceptable";
      errorType = "ClientError";
      break;
    case 407:
      customMessage = "Proxy Authentication Required";
      errorType = "ClientError";
      break;
    case 408:
      customMessage = "Request Timeout";
      errorType = "ClientError";
      break;
    case 409:
      customMessage = "Conflict";
      errorType = "ClientError";
      break;
    case 410:
      customMessage = "Gone";
      errorType = "ClientError";
      break;
    case 411:
      customMessage = "Length Required";
      errorType = "ClientError";
      break;
    case 412:
      customMessage = "Precondition Failed";
      errorType = "ClientError";
      break;
    case 413:
      customMessage = "Payload Too Large";
      errorType = "ClientError";
      break;
    case 414:
      customMessage = "URI Too Long";
      errorType = "ClientError";
      break;
    case 415:
      customMessage = "Unsupported Media Type";
      errorType = "ClientError";
      break;
    case 416:
      customMessage = "Range Not Satisfiable";
      errorType = "ClientError";
      break;
    case 417:
      customMessage = "Expectation Failed";
      errorType = "ClientError";
      break;
    case 418:
      customMessage = "I'm a teapot";
      errorType = "ClientError";
      break;
    case 500:
      customMessage = "Unable to process your request at the moment";
      errorType = "ServerError";
      break;
    case 501:
      customMessage = "Not Implemented";
      errorType = "ServerError";
      break;
    case 502:
      customMessage = "Bad Gateway";
      errorType = "ServerError";
      break;
    case 503:
      customMessage = "Service Unavailable";
      errorType = "ServerError";
      break;
    case 504:
      customMessage = "Gateway Timeout";
      errorType = "ServerError";
      break;
    case 505:
      customMessage = "HTTP Version Not Supported";
      errorType = "ServerError";
      break;
    case 506:
      customMessage = "Variant Also Negotiates";
      errorType = "ServerError";
      break;
    default:
      errorType = status < 500 ? "ClientError" : "ServerError";
  }

  return { message: customMessage, status };
}
