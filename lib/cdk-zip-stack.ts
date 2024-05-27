import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkZipStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_lambda.Function(this, "fsreadfile", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
      handler: "lambda.handler",
      code: cdk.aws_lambda.Code.fromAsset("fastify-aws-lambda/dist"),
    });
  }
}
