import React from 'react';
import SplitPane, { Pane } from 'split-pane-react';

import ExplorerPane from './Explorer_pane';
import ExplorerBody from './Explorer_body';

function Explorer(props) {
	return (
		<div className='explorer'>
			<SplitPane
				split='vertical'
				sizes={props.sizes}
				onChange={props.setSizes}
			>
				<Pane minSize={50} maxSize='50%'>
					<ExplorerPane
						tree={props.tree}
						setTree={props.setTree}
						modal={props.modal}
						setModal={props.setModal}

						storage={props.storage}
					/>
				</Pane>

				<ExplorerBody
					path={props.path}
					files={props.files}
					current={props.current}
					isLoading={props.isLoading}
					modal={props.modal}
					setModal={props.setModal}
					selectedRowIds={props.selectedRowIds}
					setSelectedRowIds={props.setSelectedRowIds}
					onClickFiles={props.onClickFiles}
					updateFiles={props.updateFiles}
					download={props.download}
					removing={props.removing}
				/>
			</SplitPane>
		</div>
	);
}

export default Explorer;

