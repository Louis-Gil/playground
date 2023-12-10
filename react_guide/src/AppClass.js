import React, { Component, Fragment } from 'react';
import './AppClass.css';
import Input from './Input';

export default class AppClass extends Component {
	constructor(props) {
		super(props);

		this.firstNameRef = React.createRef(null);
		this.lastNameRef = React.createRef(null);
		this.dobRef = React.createRef(null);

		this.state = {
			isTrue: false,
			crowd: [],
		};
	}

	setFirstName = (firstName) => {
		this.setState({ firstName });
	};

	handleSumit = (e) => {
		e.preventDefault();

		if (this.state.lastName !== '') {
			this.addPerson(this.state.firstName, this.state.lastName, this.state.dob);
		}
	};

	addPerson = (newFirst, newLast, newDOB) => {
		let newPerson = {
			id: this.state.crowd.length + 1,
			firstName: newFirst,
			lastName: newLast,
			dob: newDOB,
		};

		this.setState({ crowd: [...this.state.crowd, newPerson] });
    this.setState({ firstName: '', lastName: '', dob: '' });

		this.firstNameRef.current.value = '';
    this.lastNameRef.current.value = '';
    this.dobRef.current.value = '';
	};

	componentDidMount() {
		this.setState({
			firstName: '',
			lastName: '',
			dob: '',
			crowd: [
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
			],
		});
	}

	render() {
		return (
			<Fragment>
				<hr />
				<h1 className="h1-green">{this.props.msg}</h1>
				<hr />
				{this.state.isTrue && (
					<Fragment>
						<h1>Is True</h1>
						<hr />
					</Fragment>
				)}
				<a
					href="#!"
					className="btn btn-outline-secondary"
					onClick={this.toggleTrue}
				>
					Toggle isTrue
				</a>
				<hr />
				<form autoComplete="off" onSubmit={this.handleSumit}>
					<Input
						title="First Name"
						name="firstName"
						inputType="text"
						ref={this.firstNameRef}
						autoComplete="firstNameNew"
						className="form-control"
						onChange={(e) => this.setState({ firstName: e.target.value })}
					></Input>

					<Input
						title="Last Name"
						name="lastName"
						inputType="text"
						ref={this.lastNameRef}
						autoComplete="lastNameNew"
						className="form-control"
						onChange={(e) => this.setState({ lastName: e.target.value })}
					></Input>

					<Input
						title="Date of Birth"
						name="dob"
						inputType="date"
						ref={this.dobRef}
						autoComplete="dobNew"
						className="form-control"
						onChange={(e) => this.setState({ dob: e.target.value })}
					></Input>

					<input type="submit" value="Submit" className="btn btn-primary" />
				</form>
				<hr />

				<div>
					First Name: {this.state.firstName}
					<br />
					Last Name: {this.state.lastName}
					<br />
					Date of Birth: {this.state.dob}
					<br />
				</div>
				<hr />
				<h3>people</h3>
				<ul className="list-group">
					{this.state.crowd.map((m) => (
						<li key={m.id} className="list-group-item">
							{m.firstName} {m.lastName}
						</li>
					))}
				</ul>
			</Fragment>
		);
	}
}
