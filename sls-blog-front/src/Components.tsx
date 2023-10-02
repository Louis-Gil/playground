import React from 'react';
import { Post, PostListItem } from './models';
import { formatDate } from './utils';
import nl2br from 'react-nl2br';

export function PostList({
	postItems,
	onView,
	onNew,
}: {
	postItems: PostListItem[];
	onView: (title: string) => void;
	onNew: () => void;
}) {
	return (
		<div>
			<ul>
				{postItems.map((item) => (
					<li key={item.title} onClick={() => onView(item.title)}>
						[{formatDate(item.created)}] {item.title}
					</li>
				))}
			</ul>
			<button onClick={onNew}>New Post</button>
		</div>
	);
}

export function DateField({ label, date }: { label: string; date?: string }) {
	if (!date) {
		return null;
	}

	return (
		<>
			<dt>{label}</dt>
			<dd>{formatDate(date)}</dd>
		</>
	);
}

export function Viewer({
	post,
	onStartEdit,
	onBack,
}: {
	post: Post;
	onStartEdit: () => void;
	onBack: () => void;
}) {
	return (
		<div>
			<h1>{post.title}</h1>
			<dl>
				<DateField label="Created" date={post.created} />
				<DateField label="Updated" date={post.modified} />
				<dt>Content</dt>
				<dd>
					<p>{nl2br(post.content)}</p>
				</dd>
			</dl>
			<button onClick={onBack}>List</button>
			<button onClick={onStartEdit}>Edit</button>
		</div>
	);
}

export function Editor({
	post,
	onSave,
	onCancel,
	onDelete,
}: {
	post: Post | null;
	onSave: (title: string, content: string) => void;
	onCancel: () => void;
	onDelete: () => void;
}) {
	const [title, setTitle] = React.useState<string>(post?.title ?? '');
	const [content, setContent] = React.useState<string>(post?.content ?? '');
	return (
		<div>
			<dl>
				<dt>Title</dt>
				<dd>
					<input
						type="text"
						defaultValue={title}
						placeholder="Title"
						onChange={(event) => setTitle(event.target.value)}
					/>
				</dd>
				<DateField label="Created" date={post?.created} />
				<DateField label="Updated" date={post?.modified} />
				<dt>Content</dt>
				<dd>
					<textarea
						defaultValue={content}
						placeholder="Content"
						onChange={(event) => setContent(event.target.value)}
					/>
				</dd>
			</dl>
			<button onClick={onCancel}>cancle</button>
			<button onClick={() => onSave(title, content)}>save</button>
			{post && <button onClick={onDelete}>delete</button>}
		</div>
	);
}
