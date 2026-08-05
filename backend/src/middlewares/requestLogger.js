const pinoHttp = require("pino-http");
const logger = require("../config/logger");

const requestLogger = pinoHttp({
  logger,
  customSuccessMessage(request) {
    return `${request.method} ${request.url} completed`;
  },
  customErrorMessage(request) {
    return `${request.method} ${request.url} failed`;
  },
});

module.exports = requestLogger;