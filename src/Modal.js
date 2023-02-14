import React, { useState } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import { sizeFormat, Toogle, timeConverter } from './function';
import { useCookies } from 'react-cookie';

import del from './img/delete.svg';
import add_directory from './img/add-directory.svg';
import trash from './img/trash.svg';

function Modal(props) {
	const [cookies, setCookie] = useCookies(['show_ext']);
	const [textInput, setTextInput] = useState('');

	switch (props.modal) {
		case 'alert':
			return <div className='modal-back'>
				<div className='mini-modal'>
					<h2>{props.alert.title ?? 'Avertissement'}</h2>
					<div className="space"></div><br />
					<span>
						{props.alert.message ?? ''}
					</span>

					<div className='footer'>
						<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
							<img className="svg" src={del} alt="" />
							<span>Fermer</span>
						</div>
					</div>
				</div>
			</div>

		case 'storage':
			return <div className='modal-back'>
				<div className='modal'>
					<h2>Stockage</h2>
					<div className="space"></div><br />
					{
						props.storage === null || props.storage === undefined
							? <div className='center'>
								<SpinnerCircularFixed size={50} thickness={100} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />
							</div>
							: <>
								<div className='storage-bar' style={{ backgroundColor: 'var(--el-back-hover)' }}></div>
								<div className='storage-bar' style={{ backgroundColor: '#820282', width: `${((props.storage.disk_size - props.storage.disk_free) / props.storage.disk_size) * 100}%`, top: '-1vmin' }}></div>
								<div className='storage-bar' style={{ backgroundColor: '#ce03ce', width: `${(props.storage.all / props.storage.disk_size) * 100}%`, top: '-2vmin' }}></div>
								<div className='storage-bar' style={{ backgroundColor: '#ce0346', width: `${(props.storage.usage / props.storage.disk_size) * 100}%`, top: '-3vmin' }}></div>

								<span className='storage-round' style={{ backgroundColor: 'var(--el-back-hover)' }}></span> Total disque
								<div>{sizeFormat(props.storage.disk_size)}</div><br />

								<span className='storage-round' style={{ backgroundColor: '#820282' }}></span> Disponible
								<div>{sizeFormat(props.storage.disk_size - props.storage.disk_free)} • <b>{Math.round(((props.storage.disk_size - props.storage.disk_free) / props.storage.disk_size) * 100)}%</b></div><br />

								<span className='storage-round' style={{ backgroundColor: '#ce03ce' }}></span> Autres utilisateurs
								<div>{sizeFormat((props.storage.all - props.storage.usage))} • <b>{Math.round(((props.storage.all - props.storage.usage) / props.storage.disk_size) * 100)}%</b></div><br />

								<span className='storage-round' style={{ backgroundColor: '#ce0346' }}></span> Utilisé par vous
								<div>{sizeFormat(props.storage.usage)} • <b>{Math.round((props.storage.usage / props.storage.disk_size) * 100)}%</b></div><br />
							</>
					}

					<div className='footer'>
						<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
							<img className="svg" src={del} alt="" />
							<span>Fermer</span>
						</div>
					</div>
				</div>
			</div>

		case 'settings':
			return <div className='modal-back'>
				<div className='modal'>
					<h2>Paramètres </h2>
					<div className="space"></div><br />


					<div className='toogle-div'>
						<Toogle defaultChecked={cookies.show_ext === 'true'} onChange={(value) => setCookie('show_ext', value, { path: '/' })} />

						<label>Afficher les extensions de fichier</label>
					</div>

					<div className='footer'>
						<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
							<img className="svg" src={del} alt="" />
							<span>Fermer</span>
						</div>
					</div>
				</div>
			</div>

		case 'new_directory':
			return <div className='modal-back'>
				<div className='mini-modal'>
					<h2>Nouveau dossier </h2>
					<div className="space"></div><br />

					<div className='fluent_form'>
						<input type="text" placeholder="Nom de votre dossier" autoFocus onChange={(e) => setTextInput(e.target.value)} />
					</div>

					<div className='footer'>
						<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
							<img className="svg" src={del} alt="" />
							<span>Fermer</span>
						</div>

						<div className="small_fluent_btn blue" style={{ width: 100 }} onClick={() => props.newDirectory(props.path, textInput)}>
							<img className="svg" src={add_directory} alt="" />
							<span>Créer</span>
						</div>
					</div>
				</div>
			</div>

		case 'delete':
			if (Object.getOwnPropertyNames(props.selectedRowIds).length === 1) {
				const id = Object.keys(props.selectedRowIds);
				const el = props.files[id];
				return <div className='modal-back'>
					<div className='small-modal'>
						<h2>Supprimer</h2>
						<div className="space"></div><br />

						<span> Vous êtes sur le point de supprimer l’élément <b>{el.name}</b>. </span>

						<table>
							<tbody>
								<tr>
									<td>
										<img src={el.img} alt="" style={{ width: 100 }} />
									</td>
									<td>
										<b>{el.name}</b> <br />
										<span>{timeConverter(el.time)}</span> <br />
										<span>{sizeFormat(el.size)}</span>
									</td>
								</tr>
							</tbody>
						</table>

						<span> Cette action est irréversible, êtes-vous sur de continuer ? </span>

						<div className='footer'>
							<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
								<img className="svg" src={del} alt="" />
								<span>Fermer</span>
							</div>

							<div className="small_fluent_btn red" style={{ width: 130 }} onClick={() => props.remove(props.path, props.selectedRowIds)}>
								<img className="svg" src={trash} alt="" />
								<span>Supprimer</span>
							</div>
						</div>
					</div>
				</div>
			}
			if (Object.getOwnPropertyNames(props.selectedRowIds).length > 1) {
				const tot = Object.keys(props.selectedRowIds).length;
				return <div className='modal-back'>
					<div className='mini-modal'>
						<h2>Supprimer</h2>
						<div className="space"></div><br />

						<span> Vous êtes sur le point de supprimer <b>{tot}</b> élements. </span><br />
						<span> Cette action est irréversible, êtes-vous sur de continuer ? </span>

						<div className='footer'>
							<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
								<img className="svg" src={del} alt="" />
								<span>Fermer</span>
							</div>

							<div className="small_fluent_btn red" style={{ width: 130 }} onClick={() => props.remove(props.path, props.selectedRowIds)}>
								<img className="svg" src={trash} alt="" />
								<span>Supprimer</span>
							</div>
						</div>
					</div>
				</div>
			}
			break;

		case 'rename':
			if (Object.getOwnPropertyNames(props.selectedRowIds).length === 1) {
				const id = Object.keys(props.selectedRowIds);
				const el = props.files[id];
				return <div className='modal-back'>
					<div className='mini-modal'>
						<h2>Renommer </h2>
						<div className="space"></div><br />

						<div className='fluent_form'>
							<input type="text" placeholder="Nom de votre fichier" autoFocus defaultValue={el.name} onChange={(e) => setTextInput(e.target.value)} />
						</div>

						<div className='footer'>
							<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
								<img className="svg" src={del} alt="" />
								<span>Fermer</span>
							</div>

							<div className="small_fluent_btn blue" style={{ width: 130 }} onClick={() => props.rename(props.path, el.type !== 'directory' ? (el.name + '.' + el.type) : el.name, el.type !== 'directory' ? (textInput + '.' + el.type) : textInput)}>
								<img className="svg" src={add_directory} alt="" />
								<span>Renommer</span>
							</div>
						</div>
					</div>
				</div>
			} else {
				return <div>
					Pas content
				</div>
			}

		case 'upload':
			return <div className='modal-back'>
				<div className='small-modal'>
					<h2>Que voulez vous envoyez ? </h2>
					<div className="space"></div><br />

					<div style={{ display: "flex" }}>
						<div className="large_btn" onClick={() => props.setModal("upload_dir")}>
							<img src="https://drive.hackernwar.com/view/type/folder.png" />
							<br />
							Dossier(s)
						</div>
						<div className="large_btn" onClick={() => props.setModal("upload_file")}>
							<img src="https://drive.hackernwar.com/view/type/file.png" />
							<br />
							Fichier(s)
						</div>
					</div>

					<div className='footer'>
						<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
							<img className="svg" src={del} alt="" />
							<span>Fermer</span>
						</div>
					</div>
				</div>
			</div>

		case 'upload_dir':
			return <div className='modal-back'>
				<div className='modal'>
					<h2>Envoi de dossier</h2>
					<div className="space"></div><br />

					<input type="file" onChange={props.handleFileChange} multiple/>

					<div className='footer'>
						<div className="small_fluent_btn" style={{ width: 100 }} onClick={() => props.setModal(null)}>
							<img className="svg" src={del} alt="" />
							<span>Fermer</span>
						</div>

						<div className="small_fluent_btn green" style={{ width: 130 }} onClick={() => props.upload()}>
							<img className="svg" src={add_directory} alt="" />
							<span>Envoyer</span>
						</div>
					</div>
				</div>
			</div>

		default:
			break;

	}
}

export default Modal;
