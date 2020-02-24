import {
  checkAuth, getAuthorizerInfo, getResponses,
} from '../../libs/lambdaHelper';

const response = getResponses();
/**
 * Delete user from database
 * @param {AWSLambda.APIGatewayEvent} event The AWS Lambda Event
 * @return {AWSLambda.APIGatewayProxyResult} Response
 */
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    const authInfo = getAuthorizerInfo(event);
    // Double check
    if (!checkAuth(event)) {
      // 401 Unauthorized
      return response.custom(401, false);
    } else if (authInfo === null) {
      return response.badRequest(`No authorization information`);
    } else {
      // Do some validation and remove user from database
      return response.success();
    }
  } catch (e) {
    console.error(`Cannot delete the user. Cause: ${e.message}`);
    return response.error(`Cannot delete the user. Cause: ${e.message}`);
  }
}

export default handler;
