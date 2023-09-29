import type { AWS } from '@serverless/typescript';
import resources from './s3-cloudfront';

const config: AWS = {
	service: 'photo-optimizer-api',
	frameworkVersion: '3',
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: 'ap-northeast-2',
		logs: {
			httpApi: true,
		},
		httpApi: {
			metrics: true,
		},
		environment: {
			BUCKET_NAME: process.env.BUCKET_NAME!,
			ROOT_DOMAIN: process.env.ROOT_DOMAIN!,
			SUB_DOMAIN: process.env.SUB_DOMAIN!,
			ACM_CERTIFICATE_ARN: process.env.ACM_CERTIFICATE_ARN!,
		},
		iam: {
			role: {
				statements: [
					{
						Action: ['s3:PutObject', 's3:GetObject'],
						Effect: 'Allow',
						Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}/*`,
					},
				],
			},
		},
	},
	functions: {
		optimizeAndUpload: {
			handler: 'handler.optimizeAndUpload',
			events: [
				{
					httpApi: {
						path: '/optimize-and-upload',
						method: 'put',
					},
				},
			],
		},
	},
	plugins: ['serverless-plugin-scripts', 'serverless-webpack'],
	resources,
	custom: {
		scripts: {
			hooks: {
				'webpack:package:packageModules':
					'cp jpegoptim.tar.gz .webpack/service',
			},
		},
	},
};

export = config;
