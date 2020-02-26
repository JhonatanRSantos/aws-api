import {
  checkAuth, getResponses, getBodyParams,
} from '../../libs/lambdaHelper';
import {updateUser} from '../../models/user';

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
    } else if (!body || !body.email) {
      return responses.badRequest(`Cannot update user information. Cause: No data received`);
    } else {
      const user: User = {email: String(body.email)};
      Object.keys(body).forEach((field) => {
        if (field !== 'email') {
        // @ts-ignore
          user[field] = String(body[field]);
        }
      });
      await updateUser(user);
      return responses.success();
    }
  } catch (e) {
    console.error(`Cannot update user information. Cause: ${e.message}`);
    return responses.error(`Cannot update user information. Cause: ${e.message}`);
  }
}

export default handler;
