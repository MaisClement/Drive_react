import React from 'react';
import { useState } from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import { useNavigate, Navigate } from "react-router-dom";

import ExplorerPane from './Explorer_pane';
import ExplorerBody from './Explorer_body';
import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

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
						modal={props.modal}
						setModal={props.setModal}

						storage = {props.storage}
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
				/>
			</SplitPane>
		</div>
	);
}

export default Explorer;

