import {
  checkAuth, getResponses, getBodyParams,
} from '../../libs/lambdaHelper';
import {getAllUsers} from '../../models/user';

const responses = getResponses();

interface UserInfo {
  email?: string
}

/**
 * Gets a list of all users
 * @param {AWSLambda.APIGatewayEvent} event The AWS API Gateway Event
 * @return {AWSLambda.APIGatewayProxyResult} Response
 */
export async function handler(event: AWSLambda.APIGatewayEvent): Promise<AWSLambda.APIGatewayProxyResult> {
  try {
    // Double check
    if (!checkAuth(event)) {
      // 401 Unauthorized
      return responses.custom(401, false);
    }
    // Get body params
    const body = getBodyParams(event);
    if (!body || !body.pageSize) {
      return responses.badRequest('Body has missing properties');
    }
    // Retreive all users from database with a fixed page size
    let retreivedUsers;
    if (body.lastEvaluatedKey) {
      retreivedUsers = <AWS.DynamoDB.ScanOutput> await getAllUsers({
        Limit             : Number(body.pageSize),
        ExclusiveStartKey : {email: {S: String(body.lastEvaluatedKey)}},
      });
    } else {
      retreivedUsers = <AWS.DynamoDB.ScanOutput> await getAllUsers({
        Limit : Number(body.pageSize),
      });
    }
    // Check if has results
    if (retreivedUsers.Items) {
      return responses.success({
        users            : parseUsers(retreivedUsers.Items),
        lastEvaluatedKey : retreivedUsers.LastEvaluatedKey?.email.S,
      });
    } else {
      return responses.success('There is no users to be founded');
    }
  } catch (e) {
    return responses.error(`Cannot retreive a list of users. Cause: ${e.message}`);
  }
}

/**
 * Parse all users
 * @param {AWS.DynamoDB.ItemList} users User list
 * @return {UserInfo[]} Array of parsed users
 */
function parseUsers(users: AWS.DynamoDB.ItemList): UserInfo[] {
  return users.map((user) => {
    return {email: user.email.S};
  });
}
export default handler;
