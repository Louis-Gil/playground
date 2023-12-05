import React, { Fragment, useEffect, useState } from 'react';
import './App.css';

function HelloWorld(props) {
	const [isTrue, setIsTrue] = useState(false);
	const [crowd, setCrowd] = useState([]);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [dob, setDob] = useState('');

	const toggleTrue = () => {
		if (isTrue) {
			setIsTrue(false);
			return;
		}
		setIsTrue(true);
	};

	useEffect(() => {
		console.log('HelloWorld useEffect');

		let people = [
			{
				id: 1,
				firstName: 'Leland',
				lastName: 'Kwong',
				dob: '1980-01-01',
			},
			{
				id: 2,
				firstName: 'John',
				lastName: 'Doe',
				dob: '1980-01-01',
			},
			{
				id: 3,
				firstName: 'Jane',
				lastName: 'Doe',
				dob: '1980-01-01',
			},
		];
		setCrowd(people);
	}, []);

	return (
		<Fragment>
			<hr />
			<h1 className="h1-green">{props.msg}</h1>
			<hr />
			{isTrue && (
				<Fragment>
					<h1>Is True</h1>
					<hr />
				</Fragment>
			)}
			<a href="#!" className="btn btn-outline-secondary" onClick={toggleTrue}>
				Toggle isTrue
			</a>
			<hr />
			<form autoComplete="off">
				<div className="mb-3">
					<label className="form-label">First Name</label>
					<input
						type="text"
						name="firstName"
						id="firstName"
						autoComplete="firstNameNew"
						className="form-control"
						onChange={(e) => setFirstName(e.target.value)}
					/>
				</div>
			</form>
      <div>
        First Name: {firstName}
      </div>
			<hr />
			<h3>people</h3>
			<ul className="list-group">
				{crowd.map((m) => (
					<li key={m.id} className="list-group-item">
						{m.firstName} {m.lastName}
					</li>
				))}
			</ul>
		</Fragment>
	);
}

export default HelloWorld;
