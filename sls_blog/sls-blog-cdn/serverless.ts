import resources from './s3-cloudfront';

export = {
	service: 'simple-blog-cdn',
	frameworkVersion: '3',
	provider: {
		name: 'aws',
		region: 'ap-northeast-2',
	},
	plugins: ['serverless-s3-sync'],
	custom: {
		s3Sync: [
			{
				bucketName: process.env.WEBSITE_BUCKET_NAME!,
				localDir: '../sls-blog-front/build',
				params: [
					{ 'index.html': { CacheControl: 'no-cache' } },
					{ 'static/**/*': { CacheControl: 'public, max-age=31536000' } },
				],
			},
		],
	},
	resources,
};
