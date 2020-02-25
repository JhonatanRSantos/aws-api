import {sign} from 'jsonwebtoken';

import {getResponses, getBodyParams} from '../../libs/lambdaHelper';
import {getEnvironmentVariables} from '../../libs/tools';
import {getUser} from '../../models/user';

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
      // @ts-ignore
      const {Item}: {Item: AWS.DynamoDB.GetItemOutput} = await getUser(String(body.email));
      if (Item) {
        // @ts-ignore
        const token = sign({email: Item.email.S}, ENVIRONMENT.JWT_SECRET);
        return responses.success(token);
      } else {
        return responses.custom(401, false, 'User not found');
      }
    }
  } catch (e) {
    return responses.error(`Cannot sign in. Cause: ${e.message}`);
  }
};

export default handler;
