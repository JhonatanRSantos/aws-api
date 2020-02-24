import {getBodyParams, getResponses} from '../../libs/lambdaHelper';

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
      // Do some processing with user information and save into database
      return response.success(`New user added to database`);
    }
  } catch (e) {
    console.error(`Cannot register this user. Cause: ${e.message}`);
    return response.error(`Cannot register this user. Cause: ${e.message}`);
  }
}

export default handler;
