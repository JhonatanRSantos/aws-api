import {getBodyParams, getResponses} from '../../libs/lambdaHelper';
import {addUser} from '../../models/user';
const response = getResponses();

/**
 * Register a new user
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @return {AWSLambda.APIGatewayProxyResult} Response
 */
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    const body = getBodyParams(event);
    if (!body || !body.email || !body.password) {
      return response.error(`Email and Password are required`);
    } else {
      await addUser({
        email    : String(body.email),
        password : String(body.password),
      });
      return response.success();
    }
  } catch (e) {
    console.error(`Cannot register this user. Cause: ${e.message}`);
    return response.error(`Cannot register this user. Cause: ${e.message}`);
  }
}

export default handler;
