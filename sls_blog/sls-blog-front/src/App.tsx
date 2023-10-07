import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PostEditPage, PostListPage, PostNewPage, PostViewPage } from './Pages';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<PostListPage />} />
				<Route path="/_new" element={<PostNewPage />} />
				<Route path="/:title" element={<PostViewPage />} />
				<Route path="/:title/edit" element={<PostEditPage />} />
			</Routes>
		</BrowserRouter>
	);
}
