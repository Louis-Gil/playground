import type { AWS } from '@serverless/typescript';

const functions = {
	createPost: {
		handler: 'handler.createPost',
		events: [{ http: { path: '/api/post', method: 'post' } }],
	},
	readPost: {
		handler: 'handler.readPost',
		events: [{ http: { path: '/api/post/{title}', method: 'get' } }],
	},
	updatePost: {
		handler: 'handler.updatePost',
		events: [{ http: { path: '/api/post/{title}', method: 'put' } }],
	},
	deletePost: {
		handler: 'handler.deletePost',
		events: [{ http: { path: '/api/post/{title}', method: 'delete' } }],
	},
	listPosts: {
		handler: 'handler.listPosts',
		events: [{ http: { path: '/api/post', method: 'get' } }],
	},
	serveStatic: {
		handler: 'staticHandler.serveStatic',
		events: [
			{ http: { path: '/', method: 'get' } },
			{ http: { path: '/{fileName}', method: 'get' } },
			{ http: { path: '/static/{type}/{fileName}', method: 'get' } },
		],
	},
};

const PostTable = {
	Type: 'AWS::DynamoDB::Table',
	Properties: {
		TableName: 'post',
		KeySchema: [{ AttributeName: 'title', KeyType: 'HASH' }],
		AttributeDefinitions: [{ AttributeName: 'title', AttributeType: 'S' }],
		BillingMode: 'PAY_PER_REQUEST',
	},
};

function getVariableName(expression: { [key: string]: unknown }): string {
	return Object.keys(expression)[0];
}

const PostTableRoleStatement = {
	Effect: 'Allow',
	Action: [
		'dynamodb:PutItem',
		'dynamodb:GetItem',
		'dynamodb:UpdateItem',
		'dynamodb:DeleteItem',
	],
	Resource: { 'Fn::GetAtt': [getVariableName({ PostTable }), 'Arn'] },
};

const dynamodbLocal = {
	stages: ['dev'],
	start: { migrate: true },
};

const config: AWS = {
	service: 'simple-blog',
	frameworkVersion: '3',
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: 'ap-northeast-2',
		iam: { role: { statements: [PostTableRoleStatement] } },
		apiGateway: {
			minimumCompressionSize: 1024,
			binaryMediaTypes: ['image/*'],
		},
		tracing: {
			apiGateway: true,
			lambda: true,
		},
		httpApi: {
			cors: {
				allowedOrigins: [process.env.CORS_ALLOW_ORIGIN!],
				allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
				allowedHeaders: ['Content-Type'],
				allowCredentials: true,
			},
		},
	},
	functions,
	plugins: [
		'serverless-plugin-scripts',
		'serverless-offline',
		'serverless-webpack',
		'serverless-domain-manager',
	],
	resources: {
		Resources: { PostTable },
	},
	custom: {
		dynamodb: dynamodbLocal,
		scripts: {
			hooks: {
				'webpack:package:packExternalModules':
					'[ -d .webpack/serveStatic ] && cp -r ../sls-blog-front/build .webpack/serveStatic/pages || true',
			},
		},
		customDomain: {
			apiType: 'rest',
			domainName: `${process.env.SUB_DOMAIN}.${process.env.ROOT_DOMAIN}`,
			certificateArn: process.env.ACM_CERTIFICATE_ARN!,
			endpointType: 'edge',
			createRoute53Record: true,
		},
	},
	package: {
		individually: true,
	},
};

export = config;
