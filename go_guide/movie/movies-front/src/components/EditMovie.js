import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Input from './form/Input';
import Select from './form/Select';
import TextArea from './form/TextArea';
import Checkbox from './form/CheckBox';

const EditMovie = () => {
	const navigate = useNavigate();
	const { jwtToken } = useOutletContext();

	const [error, setError] = useState('');
	const [errors, setErrors] = useState([]);

	const mpaaOptions = [
		{ id: 'G', value: 'G' },
		{ id: 'PG', value: 'PG' },
		{ id: 'PG-13', value: 'PG-13' },
		{ id: 'R', value: 'R' },
		{ id: 'NC-17', value: 'NC-17' },
		{ id: '18A', value: '18A' },
	];

	const hasError = (key) => {
		return errors.indexOf(key) !== -1;
	};

	const [movie, setMovie] = useState({
		id: 0,
		title: '',
		release_date: '',
		runtime: '',
		mpaa_rating: '',
		description: '',
		genres: [],
		genres_array: [Array(13).fill(false)],
	});

	let { id } = useParams();
	if (id === undefined) {
		id = 0;
	}

	useEffect(() => {
		if (jwtToken === '') {
			navigate('/login');
			return;
		}

		if (id === 0) {
			// Add Movie
			setMovie({
				id: 0,
				title: '',
				release_date: '',
				runtime: '',
				mpaa_rating: '',
				description: '',
				genres: [],
				genres_array: [Array(13).fill(false)],
			});

			const headers = new Headers();
			headers.append('Content-Type', 'application/json');

			const requestOptions = {
				method: 'GET',
				headers: headers,
			};

			fetch(`/genres`, requestOptions)
				.then((response) => response.json())
				.then((data) => {
					const checks = [];

					data.forEach((genre) => {
						checks.push({ id: genre.id, checked: false, genre: genre.genre });
					});

					setMovie((m) => ({ ...m, genres: checks, genres_array: [] }));
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			// Edit Movie
		}
	}, [id, jwtToken, navigate]);

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	const handleChange = (name) => (event) => {
		let value = event.target.value;
		let name = event.target.name;
		setMovie({ ...movie, [name]: value });
	};

	const handleCheck = (event, position) => {
		console.log('handleCheck called');
		console.log('value in handleCheck: ' + event.target.value);
		console.log('checked is', event.target.checked);
		console.log('position is', position);

		let tmpArr = movie.genres;
		tmpArr[position].checked = !tmpArr[position].checked;

		let tmpIDs = movie.genres_array;
		if (!event.target.checked) {
			tmpIDs.splice(tmpIDs.indexOf(event.target.value));
		} else {
			tmpIDs.push(parseInt(event.target.value, 10));
		}

		setMovie({ ...movie, genres_array: tmpIDs });
	};

	return (
		<div>
			<h2>Add/Edit Movie</h2>
			<hr />
			<pre>{JSON.stringify(movie, null, 3)}</pre>

			<form onSubmit={handleSubmit}>
				<input type="hidden" name="id" value={movie.id} id="id" />

				<Input
					title={'Title'}
					className={'form-control'}
					type={'text'}
					name={'title'}
					value={movie.title}
					onChange={handleChange('title')}
					errorDiv={hasError('title') ? 'text-danger' : 'd-none'}
					errorMsg={'Please enter a title'}
				/>

				<Input
					title={'Release Date'}
					className={'form-control'}
					type={'date'}
					name={'release_date'}
					value={movie.release_date}
					onChange={handleChange('release_date')}
					errorDiv={hasError('release_date') ? 'text-danger' : 'd-none'}
					errorMsg={'Please enter a release date'}
				/>

				<Input
					title={'Runtime'}
					className={'form-control'}
					type={'text'}
					name={'runtime'}
					value={movie.runtime}
					onChange={handleChange('runtime')}
					errorDiv={hasError('runtime') ? 'text-danger' : 'd-none'}
					errorMsg={'Please enter a runtime'}
				/>

				<Select
					title={'MPAA Rating'}
					name={'mpaa_rating'}
					options={mpaaOptions}
					onChange={handleChange('mpaa_rating')}
					placeHolder={'Select Rating'}
					errorDiv={hasError('mpaa_rating') ? 'text-danger' : 'd-none'}
					errorMsg={'Please choose a rating'}
				/>

				<TextArea
					title={'Description'}
					name={'description'}
					value={movie.description}
					rows={3}
					onChange={handleChange('description')}
					errorDiv={hasError('description') ? 'text-danger' : 'd-none'}
					errorMsg={'Please enter a description'}
				/>

				<hr />

				<h3>Genres</h3>

				{movie.genres && movie.genres.length > 0 && (
					<>
						{Array.from(movie.genres).map((g, index) => (
							<Checkbox
								title={g.genre}
								name={'genre'}
								key={index}
								id={'genre-' + index}
								onChange={(event) => handleCheck(event, index)}
								value={g.id}
								checked={movie.genres[index].checked}
							/>
						))}
					</>
				)}
			</form>
		</div>
	);
};

export default EditMovie;
