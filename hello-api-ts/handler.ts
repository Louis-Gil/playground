import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import "source-map-support/register"

export const hello: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.queryStringParameters || !event.queryStringParameters.name) {
    console.error('Not Found', 404)
    return { statusCode: 404, body: 'Not Found' };
  }

  const message = `Hello, ${event.queryStringParameters.name}!!`;
  console.info(message);
  return { message };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
