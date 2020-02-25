import AWS, {AWSError} from 'aws-sdk';
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
 * @param {AWS.DynamoDB.TableName} TableName Table name
 * @param {AWS.DynamoDB.PutItemInputAttributeMap} Item Item to be added
 * @return {Promise<AWS.DynamoDB.PutItemOutput | AWSError>} DynamoDB response
 */
export async function addItem(TableName: AWS.DynamoDB.TableName,
    Item: AWS.DynamoDB.PutItemInputAttributeMap): Promise<AWS.DynamoDB.PutItemOutput | AWSError> {
  const params = {TableName, Item};
  return dynamoDB.putItem(params).promise();
}

/**
 * Gets an item from table
 * @param {AWS.DynamoDB.TableName} TableName Table name
 * @param {AWS.DynamoDB.Key } Key Partition key and value
 * @return {Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError>} Dynamo response
 */
export async function getItem(TableName: AWS.DynamoDB.TableName,
    Key: AWS.DynamoDB.Key): Promise<AWS.DynamoDB.GetItemOutput | AWS.AWSError> {
  const params = {TableName, Key};
  return dynamoDB.getItem(params).promise();
}
