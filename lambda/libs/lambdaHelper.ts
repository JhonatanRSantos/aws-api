interface Responses {
  success: (message?:{[key: string]: any} | string) => AWSLambda.APIGatewayProxyResult,
  error: (message?:{[key: string]: any} | string) => AWSLambda.APIGatewayProxyResult,
  badRequest: (message?:{[key: string]: any} | string) => AWSLambda.APIGatewayProxyResult,
  custom: (statusCode: number, status: boolean, message?:{[key: string]: any} | string) => AWSLambda.APIGatewayProxyResult
}

/**
 * Generates a valid API Gateway response
 * @return {Responses} Get all response types
 */
export function getResponses() : Responses {
  return {
    /**
     * Returns a success message
     * @param {Object} message Object that will be sent as request response. This will be parsed with JSON.stringifys
     * @return {AWSLambda.APIGatewayProxyResult} Response
     */
    success : function(message?:{[key: string]: any} | string): AWSLambda.APIGatewayProxyResult {
      return response(200, true, message);
    },
    /**
     * Return a error message
     * @param {Object} message Object that will be sent as request response. This will be parsed with JSON.stringifys
     * @return {AWSLambda.APIGatewayProxyResult} Response
     */
    error : function(message?:{[key: string]: any} | string): AWSLambda.APIGatewayProxyResult {
      return response(500, false, message);
    },
    /**
     * Returns a bad request response
     * @param {Object} message Object that will be sent as request response. This will be parsed with JSON.stringifys
     * @return {AWSLambda.APIGatewayProxyResult} Response
     */
    badRequest : function(message?:{[key: string]: any} | string): AWSLambda.APIGatewayProxyResult {
      return response(400, false, message);
    },
    /**
     * Returns a custom response
     * @param {Number} statusCode HTTP status code
     * @param {Boolean} status Body Status
     * @param {Object} message Body message
     * @return {AWSLambda.APIGatewayProxyResult} Response
     *
     */
    // eslint-disable-next-line max-len
    custom : function(statusCode: number, status: boolean, message?:{[key: string]: any} | string): AWSLambda.APIGatewayProxyResult {
      return response(statusCode, status, message);
    },
  };
}

/**
 * Gets a valid response
 * @param {Number} statusCode HTTP status code
 * @param {Boolean} status Body status
 * @param {Object} message Body message
 * @return {AWSLambda.APIGatewayProxyResult} API Gateway formated response
 */
function response(statusCode: number, status: boolean, message?: {[key: string]: any} | string): AWSLambda.APIGatewayProxyResult {
  return {
    statusCode,
    body : JSON.stringify({
      status  : status,
      message : message || '',
    }),
  };
}

/**
 * Get all body params
 * @param {AWSLambda.APIGatewayEvent} event The API Gateway Event
 * @return {Object | null} Response
 */
export function getBodyParams(event: AWSLambda.APIGatewayEvent): {[key: string]: string | string[]} | null {
  if (event.queryStringParameters) {
    return event.queryStringParameters;
  } else if (event.multiValueQueryStringParameters) {
    return event.multiValueQueryStringParameters;
  } else if (event.body) {
    return JSON.parse(event.body);
  } else {
    return null;
  }
}
