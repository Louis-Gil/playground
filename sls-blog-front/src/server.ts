import { Post, PostListItem } from './models';

export async function fetchPostListItems(): Promise<PostListItem[]> {
	return fetch(`/api/post`).then((res) => res.json());
}

export async function fetchPost(title: string): Promise<Post> {
	return fetch(`/api/post/${title}`).then((res) => res.json());
}

export async function createPost(
	title: string,
	content: string
): Promise<{ title: string }> {
	return fetch(`/api/post`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, content }),
	}).then((res) => res.json());
}

export async function updatePost(
	oldTitle: string,
	title: string,
	content: string
): Promise<{ title: string }> {
	return fetch(`/api/post/${oldTitle}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, content }),
	}).then((res) => res.json());
}

export async function deletePost(title: string): Promise<void> {
	const reponse = await fetch(`/api/post/${title}`, {
		method: 'DELETE',
	});
	if (!reponse.ok) {
		throw new Error('Failed to delete post');
	}
}
