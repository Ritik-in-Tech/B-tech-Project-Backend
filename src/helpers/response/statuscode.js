export const getStatusMessage = (statusCode) => {
  const messages = {
    200: "Success",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  return messages[statusCode] || "Unknown Status Code";
};
