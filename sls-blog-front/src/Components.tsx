import React from 'react';
import { Post, PostListItem } from './models';
import { formatDate } from './utils';
import nl2br from 'react-nl2br';
import { Link } from 'react-router-dom';

export function PostList({ postItems }: { postItems: PostListItem[] }) {
	return (
		<div>
			<ul>
				{postItems.map((item) => (
					<li key={item.title}>
						<Link to={`/${item.title}`}>
							[{formatDate(item.created)}] {item.title}
						</Link>
					</li>
				))}
			</ul>
			<Link to="/_new">새 글</Link>
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

export function Viewer({ post }: { post: Post }) {
	return (
		<div>
			<h1>{post.title}</h1>
			<dl>
				<DateField label="Created" date={post.created} />
				<DateField label="Updated" date={post.modified} />
				<dt>내용</dt>
				<dd>
					<p>{nl2br(post.content)}</p>
				</dd>
			</dl>
			<Link to="/">목록</Link>
			&nbsp;&nbsp;
			<Link to={`/${post.title}/edit`}>수정</Link>
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
				<dt>제목</dt>
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
				<dt>내용</dt>
				<dd>
					<textarea
						defaultValue={content}
						placeholder="Content"
						onChange={(event) => setContent(event.target.value)}
					/>
				</dd>
			</dl>
			<button onClick={onCancel}>취소</button>
			<button onClick={() => onSave(title, content)}>저장</button>
			{post && <button onClick={onDelete}>삭제</button>}
		</div>
	);
}
