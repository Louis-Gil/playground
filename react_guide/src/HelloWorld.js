import React, { Fragment, useState } from 'react';
import './HelloWorld.css';

function HelloWorld(props) {
	const [isTrue, setIsTrue] = useState(false);

	const toggleTrue = () => {
		if (isTrue) {
			setIsTrue(false);
			return;
		}
		setIsTrue(true);
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
		</Fragment>
	);
}

export default HelloWorld;
