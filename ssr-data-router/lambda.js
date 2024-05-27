import awsLambdaFastify from "@fastify/aws-lambda";
import app from "./app.js";
export const handler = awsLambdaFastify(app);
await app.ready(); // needs to be placed after awsLambdaFastify call because of the decoration: https://github.com/fastify/aws-lambda-fastify/blob/master/index.js#L9
