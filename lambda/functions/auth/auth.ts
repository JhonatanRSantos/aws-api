// @ts-nocheck
import {verify} from 'jsonwebtoken';
import {getEnvironmentVariables} from '../../libs/tools';

const {JWT_SECRET} = getEnvironmentVariables(['JWT_SECRET']);

/**
 * This lambda check if a request is authorized
 * @param {AWSLambda.APIGatewayEvent} event The API Gateway Event
 * @param {AWSLambda.Context} context Request context
 * @param {AWSLambda.Callback} callback Callback function
 */
export function handler(
    event: AWSLambda.CustomAuthorizerEvent,
    context: AWSLambda.Context,
    callback: AWSLambda.CustomAuthorizerCallback) {
  try {
    // Check JWT
    if (!JWT_SECRET) {
      console.error(`Cannot retreive JWT secret`);
      callback('Unauthorized');
    } else if (!event.authorizationToken) {
      console.error(`Missing authorization token`);
      callback('Unauthorized');
    } else {
      const token = event.authorizationToken.replace('Bearer ', '');
      const decoded = verify(token, JWT_SECRET);
      // If the jwt.verify validated - we build an IAM policy allowing the user to follow up
      // with the lambda function. Also send the lambda function everything that was inside the JWT
      // so it doesn't have to decode it again
      Object.keys(decoded).forEach((key: string) => {
        if (typeof decoded[key] === 'object') {
          decoded[key] = JSON.stringify(decoded[key]);
        }
      });
      callback(null, buildIAMPolicy(`${decoded.userId}`, 'Allow', '*', decoded));
    }
  } catch (e) {
    console.error(`Cannot authorize the request. Cause: ${e.message}`);
    callback('Unauthorized');
  }
}

/**
 * Returns an IAM policy document for a given user and resource.
 *
 * @method buildIAMPolicy
 * @param {String} userId - user id
 * @param {String} effect  - Allow / Deny
 * @param {String} resource - resource ARN
 * @param {String} context - response context
 * @return {Object} policyDocument
 */
function buildIAMPolicy(userId: string, effect: string, resource: string, context: IDecoder): AWSLambda.CustomAuthorizerResult {
  const policy: AWSLambda.CustomAuthorizerResult = {
    principalId    : userId,
    policyDocument : {
      Version   : '2012-10-17',
      Statement : [
        {
          Action   : 'execute-api:Invoke',
          Effect   : effect,
          Resource : resource,
        },
      ],
    },
    // @ts-ignore
    context,
  };
  return policy;
}
export default handler;
