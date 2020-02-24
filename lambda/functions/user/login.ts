import JWT from 'jsonwebtoken';

import {getResponses, getBodyParams} from '../../libs/lambdaHelper';
import {getEnvironmentVariables} from '../../libs/tools';

const responses = getResponses();
const ENVIRONMENT = getEnvironmentVariables(['JWT_SECRET']);

/**
 * Login lambda
 *
 * @method POST
 * @alias login
 * @alias /login
 *
 * @param {AWSLambda.APIGatewayEvent} event The AWS lambda event.
 * @return {Promise<AWSLambda.APIGatewayProxyResult>} The AWS lambda response.
 */
export async function handler(event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    const body = getBodyParams(event);
    if (!body || !body.email || !body.password) {
      return responses.badRequest(`Email and password are required`);
    } else {
      // Check if the received information exists on database
      const token = JWT.sign({email: body.email}, ENVIRONMENT.JWT_SECRET);
      return responses.success(token);
    }
  } catch (e) {
    return responses.error(e.message);
  }
};

export default handler;
