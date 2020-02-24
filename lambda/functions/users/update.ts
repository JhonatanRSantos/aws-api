import {
  checkAuth, getResponses, getBodyParams,
} from '../../libs/lambdaHelper';

const responses = getResponses();

/**
 * Update User information
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @return {AWSLambda.APIGatewayProxyResult} Response
 */
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    const body = getBodyParams(event);
    // Double check
    if (!checkAuth(event)) {
      // 401 Unauthorized
      return responses.custom(401, false);
    } else if (!body) {
      return responses.badRequest(`Cannot update user information. Cause: No data received`);
    } else {
      // Do some validation and update user information
      return responses.success();
    }
  } catch (e) {
    console.error(`Cannot update user information. Cause: ${e.message}`);
    return responses.error(`Cannot update user information. Cause: ${e.message}`);
  }
}

export default handler;
