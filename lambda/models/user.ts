import {AWSError} from 'aws-sdk';
import {addItem, getItem, scan} from '../libs/dynamoHelper';
import {getEnvironmentVariables} from '../libs/tools';

const {USERS_TABLE, ENV} = getEnvironmentVariables(['USERS_TABLE', 'ENV']);
const TableName = `${USERS_TABLE}-${ENV}`;

interface User {
  name?: string,
  email: string,
  password?: string,
  country?: string,
  countryCode?: string,
  phone?: string,
  gender?: string,
}

/**
 * Adds a new user
 * @param {User} user The user
 * @return {Promise<AWS.DynamoDB.PutItemOutput | AWSError>} Query response
 * @throws {Error} If user has missing properties
 */
export async function addUser(user: User): Promise<AWS.DynamoDB.PutItemOutput | AWSError> {
  if (!user.email || !user.password) {
    throw new Error('User email and password are required');
  }
  const retreiveduser = <AWS.DynamoDB.GetItemOutput>await getUser(user.email);
  if (retreiveduser.Item) {
    throw new Error('User alredy registered');
  }
  const Item: AWS.DynamoDB.PutItemInputAttributeMap = {
    createdAt : {
      N : `${Date.now()}`,
    },
    updatedAt : {
      N : `${Date.now()}`,
    },
  };
  Object.keys(user).forEach((key) => {
    Item[key] = {
      // @ts-ignore
      S : user[key],
    };
  });
  return addItem({TableName, Item});
}

/**
 * Gets an user from table
 * @param {String} email User email
 * @return {Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError>} Query response
 */
export async function getUser(email: string): Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError> {
  const Key = {
    email : {
      S : email,
    },
  };
  return getItem({TableName, Key, ConsistentRead: true});
}

/**
 * Get all users form database
 * @param {{Limit: Number, ExclusiveStartKey: AWS.DynamoDB.Key }} params Custom params to list all users. Limit (total elements per page). ExclusiveStartKey (lastEvaluatedKey)
 * @return {Promise<DynamoDB.ScanOutput | AWSError>}
 */
export async function getAllUsers(params: {Limit : number,
  ExclusiveStartKey?: AWS.DynamoDB.Key}): Promise<AWS.DynamoDB.ScanOutput | AWSError> {
  return scan({
    TableName,
    ConsistentRead       : true,
    ProjectionExpression : 'email',
    ...params,
  });
}
