import AWS, {AWSError, DynamoDB} from 'aws-sdk';
import {getEnvironmentVariables} from './tools';

const env = getEnvironmentVariables([
  'AWS_ACCESS_KEY_id', 'AWS_SECRET_KEY', 'AWS_REGION',
]);

const dynamoDB = new AWS.DynamoDB({
  accessKeyId     : env.AWS_ACCESS_KEY_id,
  secretAccessKey : env.AWS_SECRET_KEY,
  region          : env.AWS_REGION,
  apiVersion      : '2012-08-10',
});

/**
 * Adds an item into a table
 * @param {AWS.DynamoDB.PutItemInput} params All parameters configuration to putItem
 * @return {Promise<AWS.DynamoDB.PutItemOutput | AWSError>} DynamoDB response
 */
export async function addItem(params: AWS.DynamoDB.PutItemInput): Promise<AWS.DynamoDB.PutItemOutput | AWSError> {
  return dynamoDB.putItem(params).promise();
}

/**
 * Gets an item from table
 * @param {AWS.DynamoDB.GetItemInput} params All search parameters to getItem
 * @return {Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError>} Dynamo response
 */
export async function getItem(params: AWS.DynamoDB.GetItemInput): Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError> {
  return dynamoDB.getItem(params).promise();
}

/**
 *
 * @param {AWS.DynamoDB.TableName} TableName
 */
export async function scan(TableName: AWS.DynamoDB.TableName) {
  dynamoDB.scan();
}
