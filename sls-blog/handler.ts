import * as storage from './storage';

import { Post, PostListItem } from './models';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const createPost: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		return { statusCode: 400, body: 'Bad Request' };
	}
	const { title, content } = JSON.parse(event.body) as Post;
	const created = new Date().toISOString();

	if (!(await storage.insert({ title, content, created }))) {
		return { statusCode: 400, body: 'Bad Request' };
	}

	return { title };
};

export const readPost: APIGatewayProxyHandlerV2<Post> = async (event) => {
	if (!event.pathParameters || !event.pathParameters.title) {
		return { statusCode: 404, body: 'Not Found' };
	}

	const post = await storage.select(event.pathParameters.title);
	if (!post) {
		return { statusCode: 404, body: 'Not Found' };
	}

	return post;
};

export const updatePost: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body || !event.pathParameters || !event.pathParameters.title) {
		return { statusCode: 404, body: 'Not Found' };
	}
	const oldTitle = event.pathParameters.title;

	const { title, content } = JSON.parse(event.body) as Post;
	const modified = new Date().toISOString();

	if (!(await storage.update(oldTitle, { title, content, modified }))) {
		return { statusCode: 400, body: 'Bad Request' };
	}

	return { title };
};

export const deletePost: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.pathParameters || !event.pathParameters.title) {
		return { statusCode: 404, body: 'Not Found' };
	}

	await storage.remove(event.pathParameters.title);
	return { statusCode: 200 };
};

export const listPosts: APIGatewayProxyHandlerV2<PostListItem[]> = async () => {
	return await storage.list();
};
