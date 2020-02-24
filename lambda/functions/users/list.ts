import {getResponses} from '../../libs/lambdaHelper';

const responses = getResponses();

/**
 * Gets a list of all users
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @return {AWSLambda.APIGatewayProxyResult} Response
 */
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    return responses.success('Its works!');
  } catch (e) {
    return responses.error(e.message);
  }
}

export default handler;
