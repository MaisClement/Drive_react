import React from 'react';
import { Link, useNavigate } from "react-router-dom";

import opened_directory from './img/opened-directory.svg'
import trash from './img/trash_red.svg'
import edit_file from './img/edit-file.svg'
import download from './img/download.svg'
import drag_and_drop from './img/drag-and-drop.svg';

function Button(props) {
	const space = <span className='options-space'></span>;

	if (Object.getOwnPropertyNames(props.selectedRowIds).length == 1) {
		const id = Object.keys(props.selectedRowIds);
		if (props.files[id] === undefined) return null;
		const name = props.files[id].name;
		return (
			<>
				{space}
				{
					props.files[id].type == 'directory'
						? <Link to={`${props.path}/${name}`}>
							<div className="small_fluent_btn" style={{ width: 100 }} >
								<img className="svg" src={opened_directory} alt="" />
								<span>Ouvrir</span>
							</div>
						</Link>
						: null
				}
				<div className="small_fluent_btn" style={{ width: 130 }}>
					<img className="svg" src={download} alt="" />
					<span>Télécharger</span>
				</div>
				<div className="small_fluent_btn" style={{ width: 130 }}>
					<img className="svg" src={drag_and_drop} alt="" />
					<span>Déplacer</span>
				</div>
				<div className="small_fluent_btn" style={{ width: 130 }}>
					<img className="svg" src={edit_file} alt="" />
					<span>Renommer</span>
				</div>
				<div className="small_fluent_btn" style={{ width: 130 }} onClick={() => props.setModal('delete')}>
					<img src={trash} alt="" />
					<span>Supprimer</span>
				</div>
			</>
		)
	} else if (Object.getOwnPropertyNames(props.selectedRowIds).length > 1) {
		return (
			<>
				{space}
				<div className="small_fluent_btn" style={{ width: 130 }}>
					<img className="svg" src={download} alt="" />
					<span>Télécharger</span>
				</div>
				<div className="small_fluent_btn" style={{ width: 130 }}>
					<img className="svg" src={drag_and_drop} alt="" />
					<span>Déplacer</span>
				</div>
				<div className="small_fluent_btn" style={{ width: 130 }} onClick={() => props.setModal('delete')}>
					<img src={trash} alt="" />
					<span>Supprimer</span>
				</div>
			</>
		)
	} 
}

export default Button;