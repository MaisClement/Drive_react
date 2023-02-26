import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import del from './img/delete.svg';
import Explorer from './Explorer';
import Viewer from './Viewer';
import Modal from './Modal';

import './css/color.css';
import './css/form.css';
import './css/App.css';
import './css/Header.css';
import './css/Explorer.css';
import './css/Viewer.css';

function Header(props) {
	const { isViewMode, setViewMode } = props;
	return (
		<header>
			<div style={{ width: '100px' }}>
				<Link to={'./'}>
					<img
						src='https://drive.hackernwar.com/view/img/ftp.png'
						alt='Logo'
					/>
				</Link>
				<span className='title'>Drive</span>
			</div>
			{
				isViewMode &&
				<div className='viewer-back'>
					<img
						src={del}
						alt='Delete'
						className='light-svg'
						onClick={() => setViewMode(false)}
					/>
				</div>
			}
		</header>

	);
}

const viewerTypes = [
	'apng',
	'avif',
	'gif',
	'jpg',
	'jpeg',
	'jfif',
	'pjpeg',
	'pjp',
	'png',
	'svg',
	'webp',
	'bmp',
	'ico',
	'cur',
	'tif',
	'tiff',
];
const videoTypes = [
	'3gp',
	'mpg',
	'mpeg',
	'mp4',
	'm4v',
	'm4p',
	'ogv',
	'ogg',
	'mov',
	'webm',
];

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

	const [file] = useState([]);
	const [sizes, setSizes] = useState([30, 100, '100%']);
	const [selectedRowIds, setSelectedRowIds] = useState({});
	const [current, setCurrent] = useState(null);
	const [modal, setModal] = useState(null);
	const [alert, setAlert] = useState({});

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
		const url = base_url + 'get_files.php?p=' + path;
		setIsLoading(true);
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {

				const temp_path = data.path;
				setPath(temp_path[0] === '/' ? temp_path.substring(1) : temp_path);
				setCurrent(null);
				setIsLoading(false);

				if (typeof data.file !== 'undefined') {
					open(data.path, data.file.name, data.file.type);
				} else {
					setFiles(data.files);
				}

				if (decodeURIComponent(location.pathname).replace('/', '') != decodeURIComponent(data.path)) {
					navigate(data.path);
				}
			})
			.catch(() => {
				// 
			});
	}
	function updateFiles() {
		getFiles(location.pathname);
	}
	function goToFiles(p) {
		navigate(p);
	}
	function getDirectory(path, id = 0) {
		const url = base_url + 'get_directory.php?p=' + path + '&id=' + id;
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
		const url = base_url + 'new_directory.php?p=' + path + '&name=' + name;
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
					setViewMode(true);
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
		const url = base_url + 'rename.php?p=' + path + '&old=' + old_name + '&new=' + new_name;
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

	function remove(path, selectedfiles) {
		const ids = Object.keys(selectedfiles);
		ids.forEach(async id => {
			const filename = files[id].type === 'directory'
				? `${files[id].name}`
				: `${files[id].name}.${files[id].type}`;
			const url = base_url + 'remove.php?p=' + path + '&name=' + filename;

			await fetch(url, {
				method: 'get'
			})
				.then(res => {
					if (res.status === 401) {
						setAlert({ title: 'Permission insuffisante', message: 'Vous n\'êtes pas autorisé à créer, modifier ou supprimer des élements.' });
						setModal('alert');
						throw 'exit';
					} else if (res.status !== 200) {
						setAlert({ title: 'Suppression impossible', message: 'Une erreur s\'est produite.' });
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
		});
	}
	function handleFileChange(e) {
		const files = e.target.files;

		const list = filesInInput;
		for (let i = 0; i < files.length; i++){  
			list.push(files[i]); 
		}
		setFilesInInput(list);
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
		if (viewerTypes.includes(type)) {
			// VIEWER
			// downloadFile(path, `${name}.${type}`);
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
				isViewMode={isViewMode}
				setViewMode={setViewMode}
			/>
			{
				isViewMode
					? <Viewer
						current={current}
						setModal={setModal}
						path={path}
						files={files}
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
				handleFileChange={handleFileChange}
				filesInInput={filesInInput}

			/>
		</div>
	);
}


export default App;
