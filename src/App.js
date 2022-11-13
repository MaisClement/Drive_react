import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

import Explorer from './Explorer';
import Modal from './Modal';

import './css/color.css';
import './css/form.css';
import './css/App.css';
import './css/Header.css';
import './css/Explorer.css';

function Header() {
	return (
		<header>
			<div style={{ width: '100px' }}>
				<Link to={'./'}>
					<img
						src="https://drive.hackernwar.com/view/img/ftp.png"
						alt="Logo"
					/>
				</Link>
				<span className='title'>Drive</span>
			</div>
		</header>

	);
}

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	const base_url = "https://drive.hackernwar.com/";

	const [path, setPath] = useState(location.pathname);
	const [isLoading, setIsLoading] = useState(false);
	const [tree, setTree] = useState([]);
	const [files, setFiles] = useState([]);
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
		// getDirectory(path);
		getStorageInfo();
	}, []);

	function getFiles(path) {
		const url = base_url + "get_files.php?p=" + path;
		setIsLoading(true);
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {

				const temp_path = data.path;
				setPath(temp_path[0] === "/" ? temp_path.substring(1) : temp_path);
				setFiles(data.files);
				setCurrent(null);
				setIsLoading(false);

				if (decodeURIComponent(location.pathname).replace("/", "") != decodeURIComponent(data.path)) {
					navigate(data.path);
				}
			})
			.catch(err => {
				// 
			});
	}
	function updateFiles() {
		getFiles(location.pathname)
	}
	function goToFiles(p) {
		navigate(p);
	}
	function getDirectory(path, id = 0) {
		const url = base_url + "get_directory.php?p=" + path + "&id=" + id;
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {
				setTree(data.files);
			})
			.catch(err => {
				// 
			});
	}
	function newDirectory(path, name) {
		if (name.substring(0, 1) !== '/') {
			name = `/${name}`;
		}
		const url = base_url + "new_directory.php?p=" + path + "&name=" + name;
		fetch(url, {
			method: 'get'
		})
			.then(res => {
				if (res.status === 401) {
					setAlert({title: 'Permission insuffisante', message: 'Vous n\'êtes pas autorisé à créer, modifier ou supprimer des élements.'})
					setModal('alert');
					throw "exit";
				} else if (res.status !== 200) {
					setAlert({title: 'Création du dossier impossible', message: 'Une erreur s\'est produite.'})
					setModal('alert');
					throw "exit";
				}
				res.json()
			})
			.then(data => {
				setModal(null);
				getFiles(path + name);
			})
			.catch(err => {
				// 
			});
	}
	function getStorageInfo() {
		const url = base_url + "get_storage_info.php";
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {
				setStorage(data);
			})
			.catch(err => {
				// 
			});
	}
	function onClickFiles(row) {
		if (row.original.type === 'directory') {
			if (current === row) {
				//getFiles(`${path}/${row.original.name}`);
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
				console.log('oui');
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
		}
	}

	return (
		<div className="App">
			<Header />
			<Explorer
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

				storage = {storage}
			/>
			<Modal
				path={path}
				files={files}
				alert={alert}
				modal={modal}
				setModal={setModal}

				selectedRowIds={selectedRowIds}
				current={current}

				storage = {storage}
				newDirectory = {newDirectory}
			/>
		</div>
	);
}


export default App;
