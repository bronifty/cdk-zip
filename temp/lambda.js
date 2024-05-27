import awsLambdaFastify from "@fastify/aws-lambda";
import { createServer } from "./app.js";
const app = createServer();
export const handler = awsLambdaFastify(app);
await app.ready(); // needs to be placed after awsLambdaFastify call because of the decoration: https://github.com/fastify/aws-lambda-fastify/blob/master/index.js#L9
