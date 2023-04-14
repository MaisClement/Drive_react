import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';


import 'split-pane-react/esm/themes/default.css';
import './css/index.css';
import './css/main.css';
import './css/form.css';
import './css/color.css';
import './css/plyr.css';
import './css/Viewer.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>
);