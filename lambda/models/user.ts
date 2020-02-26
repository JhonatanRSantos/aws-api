import {AWSError} from 'aws-sdk';
import {addItem, deleteItem, getItem, scan, updateItem} from '../libs/dynamoHelper';
import {getEnvironmentVariables} from '../libs/tools';

const {USERS_TABLE, ENV} = getEnvironmentVariables(['USERS_TABLE', 'ENV']);
const TableName = `${USERS_TABLE}-${ENV}`;

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

/**
 * Delete user from database
 * @param {String} email User email
 * @return {Promise<AWS.DynamoDB.DeleteItemOutput | AWSError>} Dynamo response
 */
export async function deleteUser(email: string): Promise<AWS.DynamoDB.DeleteItemOutput | AWSError> {
  const Key = {
    email: {
      S: email
    }
  };
  return deleteItem({TableName, Key});
}

/**
 * Update user information
 * @param {User} user User information.
 * @return {Promise<AWS.DynamoDB.UpdateItemOutput | AWSError>} Dynamo response
 */
export async function updateUser(user: User): Promise<AWS.DynamoDB.UpdateItemOutput | AWSError> {
  const params: AWS.DynamoDB.UpdateItemInput = {
    TableName,
    Key: {
      email: {
        S: user.email
      }
    },
    ExpressionAttributeNames: {
      '#updatedAt': 'updatedAt'
    },
    ExpressionAttributeValues: {
      ':updatedAt': {
        N: `${Date.now()}`
      }
    },
    UpdateExpression: ''
  }

  params.UpdateExpression = '';
  Object.keys(user).forEach((filed) => {
    if(params.ExpressionAttributeNames && params.ExpressionAttributeValues && filed !== 'email'){
      params.ExpressionAttributeNames[`#${filed}`] = filed;
      params.ExpressionAttributeValues[`:${filed}`] = {
        // @ts-ignore
        S: user[filed]
      }
      if (!params.UpdateExpression) {
        params.UpdateExpression += `SET #${filed} = :${filed}`
      } else {
        params.UpdateExpression += `, #${filed} = :${filed}`
      }
    }    
  });
  params.UpdateExpression += ', #updatedAt = :updatedAt';
  return updateItem(params);
}
