import React, { } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import Tree from './Tree';
import { sizeFormat } from './function';

import settings from './img/settings.svg';
import store from './img/storage.svg';

function ExplorerPane({ setModal, storage, tree, setTree }) {
	function updateTree(data) {
		setTree(data);
	}

	return (
		<div className='pane'>

			<div className='tree'>
				{
					tree.length > 0
						? <Tree tree={tree} updateTree={updateTree} path='' />
						: <div className='center'>
							<SpinnerCircularFixed size={50} thickness={100} speed={100} color='rgba(130, 2, 130, 1)' secondaryColor='rgba(18, 18, 18, 1)' />
						</div>
				}
			</div>




			<div className='footer'></div>

			<button className='left' onClick={() => setModal('settings')}>
				<img
					src={settings}
					className='svg'
					alt='Paramètres'
				/>
				<span>Paramètres</span>
			</button>

			<button className='left' onClick={() => setModal('storage')}>
				<img
					src={store}
					className='svg'
					alt='Stockage'
				/>
				{
					storage === null || storage === undefined
						? <span>Stockage</span>
						: <span>Stockage • {sizeFormat(storage.usage)}</span>

				}

			</button>

		</div>
	);
}

export default ExplorerPane;