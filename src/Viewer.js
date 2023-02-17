import React from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import { sizeFormat, timeConverter } from './function';

import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

function Viewer(props) {
	const { current } = props;
    console.log(current);
	return (
		<div className='viewer'>

			<div className='info'>
				<span>{current.original.name}.{current.original.type}</span>
				<br />
				<span>{timeConverter(current.original.time)} • {sizeFormat(current.original.size)}</span>
			</div>
		</div>
	);
}

export default Viewer;

