import React, {  } from 'react';
import { sizeFormat } from './function';

import settings from './img/settings.svg';
import storage from './img/storage.svg';

function ExplorerPane(props) {
	return (
		<div className='pane'>

			

			<div className='footer'></div>

			<button className='left' onClick={() => props.setModal('settings')}>
				<img
					src={settings}
					className='svg'
					alt='Paramètres'
				/>
				<span>Paramètres</span>
			</button>

			<button className='left' onClick={() => props.setModal('storage')}>
				<img
					src={storage}
					className='svg'
					alt='Stockage'
				/>
				{
					props.storage === null || props.storage === undefined
						? <span>Stockage</span>
						: <span>Stockage • {sizeFormat(props.storage.usage)}</span>

				}

			</button>

		</div>
	);
}

export default ExplorerPane;