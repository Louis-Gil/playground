import * as storage from './storage';

import { Post, PostListItem } from './models';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const createPost: APIGatewayProxyHandler = async (event) => {
	if (!event.body) {
		return { statusCode: 400, body: 'Bad Request' };
	}
	const { title, content } = JSON.parse(event.body);
	const created = new Date().toISOString();

	if (!(await storage.insert({ title, content, created }))) {
		return { statusCode: 400, body: 'Bad Request' };
	}

	return { statusCode: 200, body: JSON.stringify({ title }) };
};

export const readPost: APIGatewayProxyHandler = async (event) => {
	if (!event.pathParameters || !event.pathParameters.title) {
		return { statusCode: 404, body: 'Not Found' };
	}

	const post = await storage.select(
		decodeURIComponent(event.pathParameters.title)
	);
	if (!post) {
		return { statusCode: 404, body: 'Not Found' };
	}

	return { statusCode: 200, body: JSON.stringify(post) };
};

export const updatePost: APIGatewayProxyHandler = async (event) => {
	if (!event.body || !event.pathParameters || !event.pathParameters.title) {
		return { statusCode: 404, body: 'Not Found' };
	}
	const oldTitle = decodeURIComponent(event.pathParameters.title);

	const { title, content } = JSON.parse(event.body) as Post;
	const modified = new Date().toISOString();

	if (!(await storage.update(oldTitle, { title, content, modified }))) {
		return { statusCode: 400, body: 'Bad Request' };
	}

	return { statusCode: 200, body: JSON.stringify(title) };
};

export const deletePost: APIGatewayProxyHandler = async (event) => {
	if (!event.pathParameters || !event.pathParameters.title) {
		return { statusCode: 404, body: 'Not Found' };
	}

	await storage.remove(decodeURIComponent(event.pathParameters.title));
	return { statusCode: 200, body: 'true' };
};

export const listPosts: APIGatewayProxyHandler = async () => {
	return { statusCode: 200, body: JSON.stringify(await storage.list()) };
};
