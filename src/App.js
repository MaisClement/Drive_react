/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { videoTypes, viewerTypes } from './constants';

import Header from './Header';
import Explorer from './Explorer';
import Viewer from './Viewer';
import Modal from './Modal';

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const base_url = 'https://drive.hackernwar.com/';

	const [isViewMode, setViewMode] = useState(false);

	const [path, setPath] = useState(location.pathname);
	const [isLoading, setIsLoading] = useState(false);
	const [tree, setTree] = useState([]);
	const [files, setFiles] = useState([]);
	const [filesInInput, setFilesInInput] = useState([]);

	const [file, setFile] = useState();
	const [sizes, setSizes] = useState([30, 100, '100%']);
	const [selectedRowIds, setSelectedRowIds] = useState({});
	const [current, setCurrent] = useState(null);
	const [modal, setModal] = useState(null);
	const [alert, setAlert] = useState({});

	const [removing, setRemoving] = useState(0);

	const [uploadName, setUploadName] = useState('');
	const [uploadPerc, setUploadPerc] = useState(0);
	const [uploadRemain, setUploadRemain] = useState('');
	const [uploading, setUploading] = useState(false);

	const [storage, setStorage] = useState(null);

	React.useEffect(() => {
		if (path !== location.pathname) {
			getFiles(location.pathname);
		}
	}, [location]);

	React.useEffect(() => {
		getFiles(path);
		getDirectory(path);
		getStorageInfo();
	}, []);

	function getFiles(path) {
		const url = base_url + 'get_files.php?p=' + encodeURIComponent(path);
		setIsLoading(true);
		fetch(url, {
			method: 'get'
		})
			.then(res => {
				if (res.status !== 200) {
					setAlert({ title: 'Une erreur s\'est produite.', message: 'Récupération des informations impossible.' });
					setModal('alert');
					setIsLoading(false);
					throw 'exit';
				}
				return res.json();
			})
			.then(data => {
				const temp_path = data.path;
				setPath(temp_path[0] === '/' ? temp_path.substring(1) : temp_path);
				setCurrent(null);
				setIsLoading(false);

				if (typeof data.file !== 'undefined') {
					setFile(data.file);
					open(data.path, data.file.name, data.file.type);

					if (typeof data.files !== 'undefined') {
						setFiles(data.files);
					}

				} else {
					setFiles(data.files);
					if (decodeURIComponent(location.pathname).replace('/', '') != decodeURIComponent(data.path)) {
						navigate(data.path);
					}
				}
			});
	}
	function updateFiles() {
		getFiles(location.pathname);
	}
	function goToFiles(p) {
		navigate(p);
	}
	function getDirectory(path, id = 0) {
		const url = base_url + 'get_directory.php?p=' + encodeURIComponent(path) + '&id=' + encodeURIComponent(id);
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {
				setTree(data.files);
			})
			.catch(() => {
				// 
			});
	}
	function newDirectory(path, name) {
		if (name.substring(0, 1) !== '/') {
			name = `/${name}`;
		}
		const url = base_url + 'new_directory.php?p=' + encodeURIComponent(path) + '&name=' + encodeURIComponent(name);
		fetch(url, {
			method: 'get'
		})
			.then(res => {
				if (res.status === 401) {
					setAlert({ title: 'Permission insuffisante', message: 'Vous n\'êtes pas autorisé à créer, modifier ou supprimer des élements.' });
					setModal('alert');
					throw 'exit';
				} else if (res.status !== 200) {
					setAlert({ title: 'Création du dossier impossible', message: 'Une erreur s\'est produite.' });
					setModal('alert');
					throw 'exit';
				}
				res.json();
			})
			.then(() => {
				setModal(null);
				//getFiles(path + name);
				getFiles(path);
			})
			.catch(() => {
				// 
			});
	}
	function getStorageInfo() {
		const url = base_url + 'get_storage_info.php';
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {
				setStorage(data);
			})
			.catch(() => {
				// 
			});
	}
	function onClickFiles(row) {
		if (row.original.type === 'directory') {
			if (current === row) {
				goToFiles(`${path}/${row.original.name}`);
				setCurrent(null);

			} else {
				if (current === null) {
					row.toggleRowSelected();
				} else {
					row.toggleRowSelected();
					current.toggleRowSelected();
				}
				setCurrent(row);
			}
		} else {
			if (current === row) {
				if (viewerTypes.includes(row.original.type)) {
					//VIEWER
					// setViewMode(true);
					goToFiles(`${path}/${row.original.name}.${row.original.type}`);

				} else {
					downloadFile(path, `${row.original.name}.${row.original.type}`);
					setCurrent(null);
				}

			} else {
				if (current === null) {
					row.toggleRowSelected();
				} else {
					row.toggleRowSelected();
					current.toggleRowSelected();
				}
				setCurrent(row);
			}
		}
	}
	function rename(path, old_name, new_name) {
		const url = base_url + 'rename.php?p=' + encodeURIComponent(path) + '&old=' + encodeURIComponent(old_name) + '&new=' + encodeURIComponent(new_name);
		fetch(url, {
			method: 'get'
		})
			.then(res => {
				if (res.status === 401) {
					setAlert({ title: 'Permission insuffisante', message: 'Vous n\'êtes pas autorisé à créer, modifier ou supprimer des élements.' });
					setModal('alert');
					throw 'exit';
				} else if (res.status !== 200) {
					setAlert({ title: 'Renommage impossible', message: 'Une erreur s\'est produite.' });
					setModal('alert');
					throw 'exit';
				}
				res.json();
			})
			.then(() => {
				setModal(null);
				updateFiles();
			})
			.catch(() => {
				// 
			});
	}

	async function remove(currpath, selectedfiles) {
		setModal('removing');
		setRemoving(0);
		const ids = Object.keys(selectedfiles);
		let i = 0;

		for (const id of ids) {
			const filename = files[i].type === 'directory'
				? `${files[id].name}`
				: `${files[id].name}.${files[id].type}`;
			const url = base_url + 'remove.php?p=' + encodeURIComponent(currpath) + '&name=' + encodeURIComponent(filename);

			await fetch(url, {
				method: 'get'
			})
				.then(res => {
					if (res.status === 401) {
						setAlert({ title: 'Permission insuffisante', message: 'Vous n\'êtes pas autorisé à créer, modifier ou supprimer des élements.' });
						setModal('alert');
						setRemoving(0);
						throw 'exit';
					} else if (res.status !== 200) {
						setAlert({ title: 'Suppression impossible', message: 'Une erreur s\'est produite.' });
						setModal('alert');
						setRemoving(0);
						throw 'exit';
					}
					res.json();
				})
				.then(() => {
					i++;
					setRemoving((i / ids.length) * 100);
				})
				.catch(() => {
					setAlert({ title: 'Suppression impossible', message: 'Une erreur s\'est produite.' });
					setModal('alert');
					setRemoving(0);
					throw 'exit';
				});
		}

		setModal(null);
		updateFiles();
		setRemoving(0);
	}
	function handleFileChange(e) {
		const files = e.target.files;

		const list = [];
		for (let i = 0; i < files.length; i++) {
			list.push(files[i]);
		}
		setFilesInInput(list);
	}
	async function upload() {
		// in a loop, upload each file, one by one
		const files = structuredClone(filesInInput);
		setFilesInInput([]);
		setModal(null);
		setUploading(true);
		setUploadRemain('');
		setUploadPerc(0);
		const ttime = new Date().getTime();

		let size = 0;
		let uploadedSize = 0;
		let speed = 0;
		let remain = 0;

		for (let i = 0; i < files.length; i++) {
			size += files[i].size;
		}

		for (let i = 0; i < files.length; i++) {

			setUploadName(files[i].name);

			await postFile(files[i]);

			uploadedSize += files[i].size;

			speed = uploadedSize / (new Date().getTime() - ttime);
			remain = Math.ceil(((size - uploadedSize) / speed) / 600);
			remain = Math.floor(remain / 5) * 5;

			setUploadRemain(getRemainTime(remain));
			setUploadPerc((uploadedSize / size) * 100);
		}
		updateFiles();

		setUploading('success');
		setTimeout(() => {
			setUploading(false);
		}, 1000);
	}

	function getRemainTime(remain) {
		if (remain == 5 || remain == 0)
			return 'Quelques secondes...';
		else if (remain >= 3600)
			return `${Math.floor(remain / 3600)} heures  ${Math.floor((remain % 3600) / 60)}  minutes restantes`;
		else if (remain >= 60)
			return `${Math.floor(remain / 60)} minutes ${Math.floor(remain % 60)} secondes restantes`;
		else
			return `${remain} secondes restantes`;
	}

	async function postFile(file) {
		const url = base_url + 'upload.php?p=' + encodeURIComponent(path) + '&name=' + encodeURIComponent(file.name);
		const formData = new FormData();
		formData.append('file', file);
		await fetch(url, {
			method: 'post',
			body: formData
		})
			.then(res => {
				if (res.status === 401) {
					setAlert({ title: 'Permission insuffisante', message: 'Vous n\'êtes pas autorisé à créer, modifier ou supprimer des élements.' });
					setModal('alert');
					throw 'exit';
				} else if (res.status === 409) {
					setAlert({ title: 'Conflit', message: 'Une erreur s\'est produite.' });
					setModal('alert');
					throw 'exit';
				} else if (res.status !== 200) {
					setAlert({ title: 'Upload impossible', message: 'Une erreur s\'est produite.' });
					setModal('alert');
					throw 'exit';
				}
			}
			);
	}

	function download() {
		const id = Object.keys(selectedRowIds);
		if (files[id].type !== 'directory') {
			downloadFile(path, `${files[id].name}.${files[id].type}`);
		} else {
			downloadFile(path, `${files[id].name}`);
		}
	}
	function open(path, name, type) {
		if (viewerTypes.includes(type) || videoTypes.includes(type)) {
			setViewMode(true);
		} else {
			var url = `https://drive.hackernwar.com/?ctrl=download&p=${path}/${name}.${type}`;
			window.history.replaceState(`${name}.${type}`, '', url);
		}
	}
	function downloadFile(path, name) {
		var url = `https://drive.hackernwar.com/?ctrl=download&p=${path}/${name}`;
		window.open(url);
	}

	return (
		<div className='App'>
			<Header
				path={path}
				isViewMode={isViewMode}
				setViewMode={setViewMode}
				uploading={uploading}
				uploadName={uploadName}
				uploadPerc={uploadPerc}
				uploadRemain={uploadRemain}
			/>
			{
				isViewMode
					? <Viewer
						file={file}
						setModal={setModal}
						path={path}
						files={files}
						base_url={base_url}
					/>
					: <Explorer
						path={path}
						files={files}
						tree={tree}
						isLoading={isLoading}
						sizes={sizes}
						setSizes={setSizes}
						selectedRowIds={selectedRowIds}
						current={current}
						modal={modal}
						setModal={setModal}
						setSelectedRowIds={setSelectedRowIds}
						onClickFiles={onClickFiles}
						getFiles={getFiles}
						updateFiles={updateFiles}
						download={download}
						removing={removing}

						storage={storage}
					/>
			}
			<Modal
				path={path}
				files={files}
				alert={alert}
				modal={modal}
				file={file}
				setModal={setModal}

				selectedRowIds={selectedRowIds}
				current={current}

				storage={storage}
				newDirectory={newDirectory}
				rename={rename}

				remove={remove}
				removing={removing}

				handleFileChange={handleFileChange}
				filesInInput={filesInInput}
				upload={upload}


			/>
		</div>
	);
}


export default App;
