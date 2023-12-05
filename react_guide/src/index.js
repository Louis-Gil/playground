import React from 'react';
import ReactDOM from 'react-dom/client';
import HelloWorld from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<div className="container">
			<div className="row">
				<div className="col">
					{/* <AppClass msg="hello world!" /> */}
					<HelloWorld msg="hello again!"/>
				</div>
			</div>
		</div>
	</React.StrictMode>
);
