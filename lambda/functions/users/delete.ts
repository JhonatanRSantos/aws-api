import {
  checkAuth, getAuthorizerInfo, getResponses,
} from '../../libs/lambdaHelper';

import {deleteUser} from '../../models/user';

const responses = getResponses();
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
      return responses.custom(401, false);
    } else if (authInfo === null) {
      return responses.badRequest(`No authorization information`);
    } else {
      await deleteUser(authInfo.email);
      return responses.success();
    }
  } catch (e) {
    console.error(`Cannot delete the user. Cause: ${e.message}`);
    return responses.error(`Cannot delete the user. Cause: ${e.message}`);
  }
}

export default handler;
