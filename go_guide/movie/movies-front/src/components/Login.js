import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Input from './form/input';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { setJwtToken } = useOutletContext();
	const { setAlertClassName } = useOutletContext();
	const { setAlertMessage } = useOutletContext();

	const navigate = useNavigate();

	const handleSummit = (event) => {
		event.preventDefault();

		if (email === 'admin@apple.com') {
			setJwtToken('apple');
			setAlertClassName('d-none');
			setAlertMessage('');
			navigate('/');
		} else {
			setAlertClassName('alert-danger');
			setAlertMessage('Invalid email or password.');
		}
	};

	return (
		<div className="col-md-6 offset-md-3">
			<h2>Login</h2>
			<hr />

			<form onSubmit={handleSummit}>
				<Input
					title="Email Address"
					type="email"
					className="form-control"
					name="email"
					autoComplete="email-new"
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Input
					title="Password"
					type="password"
					className="form-control"
					name="password"
					autoComplete="password-new"
					onChange={(e) => setPassword(e.target.value)}
				/>

				<hr />

				<input type="submit" value="Login" className="btn btn-primary" />
			</form>
		</div>
	);
};

export default Login;
