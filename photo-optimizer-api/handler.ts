import * as AWS from 'aws-sdk';
import * as childProcess from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';

import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import getStream from 'get-stream';
import * as tar from 'tar';

const s3 = new AWS.S3();

export const getSignedURL: APIGatewayProxyHandlerV2<unknown> = async () => {
	const photoKey = `${new Date().getTime()}${Math.random()}`;
	const uploadURL = await s3.getSignedUrlPromise('putObject', {
		Bucket: process.env.BUCKET_NAME!,
		Key: `raw/${photoKey}.jpg`,
		Expires: 5 * 60,
	});
	return { photoKey, uploadURL };
};

export const optimizeAndUpload: APIGatewayProxyHandlerV2 = async (event) => {
	const { photoKey } = event.queryStringParameters ?? {};
	if (!photoKey) {
		return { statusCode: 400 };
	}
	const rawKey = `raw/${photoKey}.jpg`;
	if (!(await s3Exists(process.env.BUCKET_NAME!, rawKey))) {
		return { statusCode: 404 };
	}

	const buffer = await getStream.buffer(
		s3
			.getObject({
				Bucket: process.env.BUCKET_NAME!,
				Key: rawKey,
			})
			.createReadStream()
	);

	const hash = crypto.createHash('md5').update(buffer).digest('hex');
	const filePath = `/tmp/${hash}.jpg`;
	fs.writeFileSync(filePath, buffer);

	const resultKey = `photo/${hash}.jpg`;
	const cdnURL = `https://${process.env.SUB_DOMAIN}.${process.env.ROOT_DOMAIN}/${resultKey}`;

	try {
		if (await s3Exists(process.env.BUCKET_NAME!, resultKey)) {
			return { cdnURL };
		}
		await unpackJpegoptim();
		childProcess.execSync(`${jpegoptimPath} -o -s -m80 ${filePath}`);

		await s3
			.upload({
				Bucket: process.env.BUCKET_NAME!,
				Key: resultKey,
				Body: fs.createReadStream(filePath),
				ContentType: 'image/jpeg',
			})
			.promise();
		return { cdnURL };
	} finally {
		fs.unlinkSync(filePath);
		await s3
			.deleteObject({
				Bucket: process.env.BUCKET_NAME!,
				Key: rawKey,
			})
			.promise();
	}
};

async function s3Exists(bucketName: string, key: string): Promise<boolean> {
	try {
		await s3.headObject({ Bucket: bucketName, Key: key }).promise();
		return true;
	} catch (err: any) {
		if (err.code === 'Forbidden') {
			return false;
		}
		throw err;
	}
}

const jpegoptimPath = '/tmp/bin/jpegoptim';
const jpegoptimPachFile = 'jpegoptim.tar.gz';

async function unpackJpegoptim(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (fs.existsSync(jpegoptimPath)) {
			return resolve();
		}
		fs.createReadStream(jpegoptimPachFile)
			.pipe(
				tar.x({ strip: 1, C: '/tmp' }).on('error', reject).on('close', resolve)
			)
			.on('error', reject);
	});
}
