import React from 'react';
import { Link } from 'react-router-dom';

import opened_directory from './img/opened-directory.svg';
import trash from './img/trash_red.svg';
import edit_file from './img/edit-file.svg';
import download from './img/download.svg';
// eslint-disable-next-line no-unused-vars
import drag_and_drop from './img/drag-and-drop.svg';

function removeButton(props, show) {
	if (props.removing == 0 && show == false) {
		return null;
	} else if (props.removing == 0 && show == true) {
		return <button key={'delete'} style={{ width: 130 }} onClick={() => props.setModal('delete')}>
			<img src={trash} alt='' />
			<span>Supprimer</span>
		</button>;
	} else {
		return <button
			className='is-inline-block'
			style={{ width: 145 }}
			onClick={() => props.setModal('removing')}
		>
			<div className='is-flex is-align-items-center' style={{ gap: 10 }}>
				<img src={trash} alt='' />
				<span>Suppression</span>
			</div>
			<div className='mini_progress' style={{ width: `${props.removing}%` }} />
		</button>;
	}
}

function Button(props) {
	const space = <span className='options-space'></span>;

	if (Object.getOwnPropertyNames(props.selectedRowIds).length === 1) {
		const id = Object.keys(props.selectedRowIds);
		if (props.files[id] === undefined) return null;
		const name = props.files[id].name;
		return <>
			{space}
			{
				props.files[id].type == 'directory'
					? <Link to={`${props.path}/${name}`}>
						<button style={{ width: 100 }} >
							<img className='svg' src={opened_directory} alt='' />
							<span>Ouvrir</span>
						</button>
					</Link>
					: null
			}
			<button style={{ width: 130 }} onClick={() => props.download()}>
				<img className='svg' src={download} alt='' />
				<span>Télécharger</span>
			</button>
			{
				/*
				<button style={{ width: 130 }}>
					<img className='svg' src={drag_and_drop} alt='' />
					<span>Déplacer</span>
				</button>
				*/
			}
			<button style={{ width: 130 }} onClick={() => props.setModal('rename')}>
				<img className='svg' src={edit_file} alt='' />
				<span>Renommer</span>
			</button>
			<button key={'delete'} style={{ width: 130 }} onClick={() => props.setModal('delete')}>
				<img src={trash} alt='' />
				<span>Supprimer</span>
			</button>

		</>;
	} else if (Object.getOwnPropertyNames(props.selectedRowIds).length > 1) {
		return <>
			{space}
			{
				/*<button style={{ width: 130 }}>
				<img className='svg' src={download} alt='' />
				<span>Télécharger</span>
			</button>
			<button style={{ width: 130 }}>
				<img className='svg' src={drag_and_drop} alt='' />
				<span>Déplacer</span>
			</button>
				*/
			}
			{removeButton(props, true)}
		</>;
	} else {
		return <>
			{space}
			{removeButton(props, false)}
		</>;
	}
}

export default Button;