import { Post, PostListItem } from './models';
import { PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

import { DynamoDB } from 'aws-sdk';
import { deepEqual } from 'fast-equals';

const db = !process.env.IS_OFFLINE
  ? new DynamoDB.DocumentClient()
  : new DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
const TableName = 'post';

export async function insert(post: Post): Promise<boolean> {
	try {
		await createItem(post);
	} catch (error: any) {
		if (error.code === 'ConditionalCheckFailedException' || error.retryable) {
			return false;
		}
		throw error;
	}
	await modifyPostEntries((entries) =>
		entries.concat({ title: post.title, created: post.created })
	);
	return true;
}

export async function select(title: string): Promise<Post | null> {
	const postData = await db.get({ TableName, Key: { title } }).promise();
	return postData.Item as Post | null;
}

export async function update(
	oldTitle: string,
	post: Omit<Post, 'created'>
): Promise<boolean> {
	if (oldTitle === post.title) {
		await db
			.update({
				TableName,
				Key: { title: oldTitle },
				UpdateExpression: 'SET content = :content, modified = :modified',
				ExpressionAttributeValues: {
					':content': post.content,
					':modified': post.modified,
				},
			})
			.promise();
	} else {
		const oldPost = await select(oldTitle);
		if (!oldPost) {
			return false;
		}

		const maybeNewExisting = await select(post.title);
		if (maybeNewExisting) {
			return false;
		}

		const newPost = { ...oldPost, ...post };
		try {
			await db
				.transactWrite({
					TransactItems: [
						{
							Delete: {
								TableName,
								Key: { title: oldTitle },
								ConditionExpression: 'attribute_exists(title)',
							},
						},
						{
							Put: {
								TableName,
								Item: newPost,
								ConditionExpression: 'attribute_not_exists(title)',
							},
						},
					],
				})
				.promise();
		} catch (error: any) {
			if (error.code === 'ConditionalCheckFailedException' || error.retryable) {
				return false;
			}
		}
		await modifyPostEntries((entries) =>
			entries
				.filter((entry) => entry.title !== oldTitle)
				.concat({ title: newPost.title, created: newPost.created })
		);
	}
	return true;
}

export async function remove(title: string): Promise<void> {
	await db.delete({ TableName, Key: { title } }).promise();
  await modifyPostEntries((entries) =>
    entries.filter((entry) => entry.title !== title)
  );
}

export async function list(): Promise<PostListItem[]> {
	return (await fetchPosts()).entries;
}

//

async function createItem<
	T extends DynamoDB.DocumentClient.PutItemInputAttributeMap
>(item: T): Promise<void> {
	await db
		.put({
			TableName,
			Item: item,
			ConditionExpression: 'attribute_not_exists(title)',
		})
		.promise();
}

async function updateItem<T extends { version: number }>(
	item: T
): Promise<void> {
	await db
		.put({
			TableName,
			Item: item,
			ConditionExpression: 'version = :version',
			ExpressionAttributeValues: { ':version': item.version - 1 },
		})
		.promise();
}

const listTitle = '$_';

interface Posts {
	title: typeof listTitle;
	version: number;
	entries: PostListItem[];
}

async function fetchPosts(): Promise<Posts> {
	const postObject = await db
		.get({ TableName, Key: { title: listTitle } })
		.promise();
	return (
		(postObject.Item as Posts) ?? { title: listTitle, version: 0, entries: [] }
	);
}

const maxRetryCount = 10;

async function modifyPostEntries(
	modify: (entries: PostListItem[]) => PostListItem[]
): Promise<void> {
	for (let i = 0; i < maxRetryCount; ++i) {
		const posts = await fetchPosts();
		const entries = modify(posts.entries).sort((a, b) =>
			b.created.localeCompare(a.created)
		);
		try {
			if (!deepEqual(posts.entries, entries)) {
				const newPosts = { ...posts, version: posts.version + 1, entries };
				if (posts.version === 0) {
					await createItem(newPosts);
				} else {
					await updateItem(newPosts);
				}
			}
			return;
		} catch (error: any) {
			if (error.code === 'ConditionalCheckFailedException' || error.retryable) {
				continue;
			}
			throw error;
		}
	}
	throw new Error('Failed to update posts');
}
