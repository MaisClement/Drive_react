import React from 'react';
import Files_table from './Files_table';
import Path from './Path';
import Button from './Explorer_button';
import { useNavigate } from 'react-router-dom';

import update from './img/update.svg';
import add_directory from './img/add-directory.svg';
import upload from './img/upload.svg';

import back from './img/back.svg';
import right from './img/right.svg';

function ExplorerBody(props) {
	const navigate = useNavigate();

	return (
		<section>
			<div className='options is-flex'>
				<button style={{width: 42}} onClick={() => props.setModal('new_directory')}>
					<img className='svg' src={add_directory} />
				</button>
				<button style={{width: 42}} onClick={() => props.setModal('upload')}>
					<img className='svg' src={upload} />
				</button>

				<Button
					files={props.files}
					path={props.path}
					selectedRowIds={props.selectedRowIds}
					current={props.current}
					setModal={props.setModal}
					download= {props.download}
					removing={props.removing}
				/>

			</div>

			<div className='nav is-flex'>
				<button  style={{width: 42}} onClick={() => navigate(-1)}>
					<img className='svg' src={back} />
				</button>
				<button  style={{width: 42}}  onClick={() => navigate(1)}>
					<img className='svg' src={right} />
				</button>
				<button  style={{width: 42}}  onClick={() => props.updateFiles()}>
					<img className='svg' src={update} />
				</button>
				<Path
					path={props.path}
				/>
			</div>

			<div className='explorer-space'></div>
			<i className={props.isLoading ? 'loader-4' : 'loader-4 is-hidden'}></i>

			<div className='files'>
				<Files_table
					files={props.files}
					path={props.path}
					setSelectedRowIds={props.setSelectedRowIds}
					onClickFiles={props.onClickFiles}
				/>
			</div>
		</section>
	);
}

export default ExplorerBody;