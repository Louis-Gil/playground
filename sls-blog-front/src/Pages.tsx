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
import { useNavigate, useParams } from 'react-router-dom';

export function PostListPage() {
	const [postItems, setPostItems] = React.useState<PostListItem[]>([]);
	React.useEffect(() => {
		fetchPostListItems().then(setPostItems).catch(alert);
	}, []);
	return <PostList postItems={postItems} />;
}

export function PostViewPage() {
	const { title } = useParams<'title'>();
	const [post, setPost] = React.useState<Post | null>(null);

	React.useEffect(() => {
		fetchPost(title!).then(setPost).catch(alert);
	}, [title]);

	if (!post) {
		return <p>불러오는 중...</p>;
	}
	return <Viewer post={post} />;
}

export function PostNewPage() {
	const navigate = useNavigate();

	return (
		<Editor
			post={null}
			onSave={(title, content) =>
				createPost(title, content)
					.then(() => navigate(`/${title}`, { replace: true }))
					.catch(alert)
			}
			onCancel={() => navigate(-1)}
			onDelete={() => {}}
		/>
	);
}

export function PostEditPage() {
	const navigate = useNavigate();
	const { title } = useParams<'title'>();
	const [post, setPost] = React.useState<Post | null>(null);

	React.useEffect(() => {
		fetchPost(title!).then(setPost).catch(alert);
	}, [title]);

	if (!post) {
		return <p>불러오는 중...</p>;
	}

	return (
		<Editor
			post={post}
			onSave={(title, content) =>
				updatePost(post.title, title, content)
					.then(() => navigate(`/${title}`, { replace: true }))
					.catch(alert)
			}
			onCancel={() => navigate(-1)}
			onDelete={() =>
				deletePost(post.title)
					.then(() => navigate('/', { replace: true }))
					.catch(alert)
			}
		/>
	);
}
