import React, { useState } from 'react';
import { SpinnerCircularFixed } from 'spinners-react';
import { sizeFormat, Toogle, timeConverter } from './function';
import { useCookies } from 'react-cookie';

import del from './img/delete.svg';
import add_directory from './img/add-directory.svg';
import trash from './img/trash.svg';

function Modal({ modal, alert, storage, newDirectory, path, remove, removing, files, rename, upload, selectedRowIds, handleFileChange, filesInInput, setModal }) {
	const [cookies, setCookie] = useCookies(['show_ext']);
	const [textInput, setTextInput] = useState('');

	switch (modal) {
	case 'alert':
		return <div className='modal-back'>
			<div className='mini-modal'>
				<h2>{alert.title ?? 'Avertissement'}</h2>
				<div className='space'></div><br />
				<span>
					{alert.message ?? ''}
				</span>

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>
				</div>
			</div>
		</div>;

	case 'storage':
		return <div className='modal-back'>
			<div className='modal'>
				<h2>Stockage</h2>
				<div className='space'></div><br />
				{
					storage === null || storage === undefined
						? <div className='center'>
							<SpinnerCircularFixed size={50} thickness={100} speed={100} color='rgba(130, 2, 130, 1)' secondaryColor='rgba(18, 18, 18, 1)' />
						</div>
						: <>
							<div className='storage-bar' style={{ backgroundColor: 'var(--el-back-hover)' }}></div>
							<div className='storage-bar' style={{ backgroundColor: '#820282', width: `${((storage.disk_size - storage.disk_free) / storage.disk_size) * 100}%`, top: '-1vmin' }}></div>
							<div className='storage-bar' style={{ backgroundColor: '#ce03ce', width: `${(storage.all / storage.disk_size) * 100}%`, top: '-2vmin' }}></div>
							<div className='storage-bar' style={{ backgroundColor: '#ce0346', width: `${(storage.usage / storage.disk_size) * 100}%`, top: '-3vmin' }}></div>

							<span className='round_size' style={{ backgroundColor: 'var(--el-back-hover)' }}></span> Total disque
							<div>{sizeFormat(storage.disk_size)}</div><br />

							<span className='round_size' style={{ backgroundColor: '#820282' }}></span> Disponible
							<div>{sizeFormat(storage.disk_size - storage.disk_free)} • <b>{Math.round(((storage.disk_size - storage.disk_free) / storage.disk_size) * 100)}%</b></div><br />

							<span className='round_size' style={{ backgroundColor: '#ce03ce' }}></span> Autres utilisateurs
							<div>{sizeFormat((storage.all - storage.usage))} • <b>{Math.round(((storage.all - storage.usage) / storage.disk_size) * 100)}%</b></div><br />

							<span className='round_size' style={{ backgroundColor: '#ce0346' }}></span> Utilisé par vous
							<div>{sizeFormat(storage.usage)} • <b>{Math.round((storage.usage / storage.disk_size) * 100)}%</b></div><br />
						</>
				}

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>
				</div>
			</div>
		</div>;

	case 'settings':
		return <div className='modal-back'>
			<div className='modal'>
				<h2>Paramètres </h2>
				<div className='space'></div><br />


				<div className='toogle-div'>
					<Toogle defaultChecked={cookies.show_ext === 'true'} onChange={(value) => setCookie('show_ext', value, { path: '/' })} />

					<label>Afficher les extensions de fichier</label>
				</div>

				<br /><br /><br />

				<h3>À propos </h3>
				<a href='https://github.com/MaisClement/Drive' target='_blank' className='link_blue' rel='noreferrer'> Code source </a>
				<br />
				<a href='https://icones8.fr/' target='_blank' className='link_blue' rel='noreferrer'> Icones par Icones8 </a>

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>
				</div>
			</div>
		</div>;

	case 'new_directory':
		return <div className='modal-back'>
			<div className='mini-modal'>
				<h2>Nouveau dossier </h2>
				<div className='space'></div><br />

				<input type='text' placeholder='Nom de votre dossier' autoFocus onChange={(e) => setTextInput(e.target.value)} />

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>

					<button className='blue' style={{ width: 100 }} onClick={() => newDirectory(path, textInput)}>
						<img className='svg_white' src={add_directory} alt='' />
						<span>Créer</span>
					</button>
				</div>
			</div>
		</div>;

	case 'removing':
		return <div className='modal-back'>
			<div className='mini-modal'>
				<h2>Suppression </h2>
				<div className='space'></div><br />

				<p>
						Suppression de vos fichiers en cours.
				</p>

				<div className='progress-bck'></div>
				<div className='progress' style={{ width: `${removing}%` }}></div>

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>
				</div>
			</div>
		</div>;

	case 'delete':
		if (Object.getOwnPropertyNames(selectedRowIds).length === 1) {
			const id = Object.keys(selectedRowIds);
			const el = files[id];
			return <div className='modal-back'>
				<div className='small-modal'>
					<h2>Supprimer</h2>
					<div className='space'></div><br />

					<span> Vous êtes sur le point de supprimer l’élément <b>{el.name}</b>. </span>

					<table>
						<tbody>
							<tr>
								<td>
									<img src={el.img} alt='' style={{ width: 100 }} />
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
						<button style={{ width: 100 }} onClick={() => setModal(null)}>
							<img className='svg' src={del} alt='' />
							<span>Fermer</span>
						</button>

						<button className='red' style={{ width: 130 }} onClick={async () => await remove(path, selectedRowIds)}>
							<img className='svg_white' src={trash} alt='' />
							<span>Supprimer</span>
						</button>
					</div>
				</div>
			</div>;
		}
		if (Object.getOwnPropertyNames(selectedRowIds).length > 1) {
			const tot = Object.keys(selectedRowIds).length;
			return <div className='modal-back'>
				<div className='mini-modal'>
					<h2>Supprimer</h2>
					<div className='space'></div><br />

					<span> Vous êtes sur le point de supprimer <b>{tot}</b> élements. </span><br />
					<span> Cette action est irréversible, êtes-vous sur de continuer ? </span>

					<div className='footer'>
						<button style={{ width: 100 }} onClick={() => setModal(null)}>
							<img className='svg' src={del} alt='' />
							<span>Fermer</span>
						</button>

						<button className='red' style={{ width: 130 }} onClick={() => remove(path, selectedRowIds)}>
							<img className='svg_white' src={trash} alt='' />
							<span>Supprimer</span>
						</button>
					</div>
				</div>
			</div>;
		}
		break;

	case 'rename':
		if (Object.getOwnPropertyNames(selectedRowIds).length === 1) {
			const id = Object.keys(selectedRowIds);
			const el = files[id];
			return <div className='modal-back'>
				<div className='mini-modal'>
					<h2>Renommer </h2>
					<div className='space'></div><br />

					<input type='text' placeholder='Nom de votre fichier' autoFocus defaultValue={el.name} onChange={(e) => setTextInput(e.target.value)} />

					<div className='footer'>
						<button style={{ width: 100 }} onClick={() => setModal(null)}>
							<img className='svg' src={del} alt='' />
							<span>Fermer</span>
						</button>

						<button className='blue' style={{ width: 130 }} onClick={() => rename(path, el.type !== 'directory' ? (el.name + '.' + el.type) : el.name, el.type !== 'directory' ? (textInput + '.' + el.type) : textInput)}>
							<img className='svg_white' src={add_directory} alt='' />
							<span>Renommer</span>
						</button>
					</div>
				</div>
			</div>;
		} else {
			return <div>
					Pas content
			</div>;
		}

	case 'upload':
		return <div className='modal-back'>
			<div className='small-modal'>
				<h2>Que voulez vous envoyez ? </h2>
				<div className='space'></div><br />

				<div style={{ display: 'flex' }}>
					<div className='large_btn' onClick={() => setModal('upload_dir')}>
						<img src='https://drive.hackernwar.com/view/type/folder.png' />
						<br />
							Dossier(s)
					</div>
					<div className='large_btn' onClick={() => setModal('upload_file')}>
						<img src='https://drive.hackernwar.com/view/type/file.png' />
						<br />
							Fichier(s)
					</div>
				</div>

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>
				</div>
			</div>
		</div>;

	case 'upload_file':
		return <div className='modal-back'>
			<div className='modal'>
				<h2>Envoi de fichier</h2>
				<div className='space'></div><br />
				<input type='file' onChange={(e) => handleFileChange(e)} multiple />

				<div className='scrollable' style={{ maxHeight: 'calc(100% - 170px)' }}>
					{
						filesInInput.map((file) => (
							<p key={file.name}>
								{file.name}
							</p>
						))
					}
				</div>

				<div className='footer'>
					<button style={{ width: 100 }} onClick={() => setModal(null)}>
						<img className='svg' src={del} alt='' />
						<span>Fermer</span>
					</button>

					<button className='green' style={{ width: 130 }} onClick={() => upload()}>
						<img className='svg_white' src={add_directory} alt='' />
						<span>Envoyer</span>
					</button>
				</div>
			</div>
		</div>;

	default:
		break;

	}
}

export default Modal;
