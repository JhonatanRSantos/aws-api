import {getResponses} from '../../libs/lambdaHelper';

const responses = getResponses();

/**
 * Gets a list of all users
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @return {AWSLambda.APIGatewayProxyResult} Response
 */
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    // Go database an get a list of all users
    return responses.success([
      {username: 'Qwerty', sex: 'Manle'},
      {username: 'Asdf', sex: 'Female'},
    ]);
  } catch (e) {
    return responses.error(e.message);
  }
}

export default handler;
