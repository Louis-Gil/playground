import React, { Fragment, useEffect, useState } from 'react';
import './App.css';
import Input from './Input';

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

	const handleSumit = (e) => {
		e.preventDefault();

		if (lastName !== '') {
			addPerson(firstName, lastName, dob);
		}
	};

	const addPerson = (newFirst, newLast, newDOB) => {
		let newPerson = {
			id: crowd.length + 1,
			firstName: newFirst,
			lastName: newLast,
			dob: newDOB,
		};

		const newList = [...crowd, newPerson];

		const sorted = newList.sort((a, b) => {
			return a.lastName.localeCompare(b.lastName);
		});
		setCrowd(sorted);
		setFirstName('');
		setLastName('');
		setDob('');
	};

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
			<form autoComplete="off" onSubmit={handleSumit}>
				<Input
					title="First Name"
					name="firstName"
					inputType="text"
					autoComplete="firstNameNew"
					className="form-control"
					onChange={(e) => setFirstName(e.target.value)}
				></Input>

				<Input
					title="Last Name"
					name="lastName"
					inputType="text"
					autoComplete="lastNameNew"
					className="form-control"
					onChange={(e) => setLastName(e.target.value)}
				></Input>

				<Input
					title="Date of Birth"
					name="dob"
					inputType="date"
					autoComplete="dobNew"
					className="form-control"
					onChange={(e) => setDob(e.target.value)}
				></Input>

				<input type="submit" value="Submit" className="btn btn-primary" />
			</form>
      <hr />

			<div>
				First Name: {firstName}
				<br />
				Last Name: {lastName}
				<br />
				Date of Birth: {dob}
				<br />
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
