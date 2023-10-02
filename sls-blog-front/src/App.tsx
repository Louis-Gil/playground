import React from 'react';
import { Post, PostListItem } from './models';
import {
	createPost,
	deletePost,
	fetchPost,
	fetchPostListItems,
	updatePost,
} from './server';
import { Editor, PostList, Viewer } from './Components';

export default function App() {
	const [postItems, setPostItems] = React.useState<PostListItem[]>([]);
	const [post, setPost] = React.useState<Post | null>(null);
	const [editMode, setEditMode] = React.useState<boolean>(false);

	function refreshPostList() {
		fetchPostListItems().then(setPostItems).catch(alert);
	}

	React.useEffect(() => {
		refreshPostList();
	}, []);

	if (!editMode) {
		if (post) {
			return (
				<Viewer
					post={post}
					onStartEdit={() => setEditMode(true)}
					onBack={() => setPost(null)}
				/>
			);
		}
		return (
			<PostList
				postItems={postItems}
				onView={(title) => {
					setEditMode(false);
					fetchPost(title).then(setPost).catch(alert);
				}}
				onNew={() => {
					setPost(null);
					setEditMode(true);
				}}
			/>
		);
	}
	return (
		<Editor
			post={post}
			onSave={(title, content) =>
				(post
					? updatePost(post.title, title, content)
					: createPost(title, content)
				)
					.then(() => fetchPost(title).then(setPost).catch(alert))
					.then(() => setEditMode(false))
					.then(() => refreshPostList())
					.catch(alert)
			}
			onCancel={() => setEditMode(false)}
			onDelete={() =>
				post
					? deletePost(post.title)
							.then(() => setPost(null))
							.then(() => setEditMode(false))
							.then(() => refreshPostList())
							.catch(alert)
					: 0
			}
		/>
	);
}
