import {AWSError} from 'aws-sdk';
import {addItem, getItem} from '../libs/dynamoHelper';
import {getEnvironmentVariables} from '../libs/tools';

const {USERS_TABLE, ENV} = getEnvironmentVariables(['USERS_TABLE', 'ENV']);

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
  const retreiveduser = await getUser(user.email);
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
  return addItem(`${USERS_TABLE}-${ENV}`, Item);
}

/**
 * Gets an user from table
 * @param {String} email User email
 * @return {Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError>} Query response
 */
export async function getUser(email: string): Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError> {
  const key = {
    email : {
      S : email,
    },
  };
  return getItem(`${USERS_TABLE}-${ENV}`, key);
}
