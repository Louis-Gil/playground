import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ManageCatalog = () => {
	const [movies, setMovies] = useState([]);
	const { jwtToken } = useOutletContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (jwtToken === '') {
			navigate('/login');
			return;
		}

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${jwtToken}`)

		const requestOptions = {
			method: 'GET',
			headers: headers,
		};

		fetch(`/admin/movies`, requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setMovies(data);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [jwtToken, navigate]);

	return (
		<div>
			<h2>Manage Catalogue</h2>
			<hr />
			<table className="table table-striped table-hover">
				<thead>
					<tr>
						<th>Movie</th>
						<th>Release Date</th>
						<th>Rating</th>
					</tr>
				</thead>
				<tbody>
					{movies.map((movie) => (
						<tr key={movie.id}>
							<td>
								<Link to={`/admin/movies/${movie.id}`}>{movie.title}</Link>
							</td>
							<td>{movie.release_date}</td>
							<td>{movie.mpaa_rating}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ManageCatalog;
