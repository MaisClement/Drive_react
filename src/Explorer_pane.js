import React, { useRef, useState } from "react";
import { SpinnerCircularFixed } from 'spinners-react';
import { IoMdArrowDropright } from "react-icons/io";
import TreeView from "react-accessible-treeview";
import {sizeFormat, Toogle} from './function';

import 'split-pane-react/esm/themes/default.css'
import './css/App.css';
import './css/Header.css';

import settings from './img/settings.svg';
import storage from './img/storage.svg';
import directory from './img/directory.png';
import opened_directory from './img/opened_directory.png';

function MultiSelectCheckboxAsync(props) {
	const loadedAlertElement = useRef(null);
	const [data, setData] = useState(props.data);
	const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState([]);

	const updateTreeData = (list, id, children) => {
		const data = list.map((node) => {
			if (node.id === id) {
				node.children = children.map((el) => {
					return el.id;
				});
			}
			return node;
		});
		return data.concat(children);
	};

	const onLoadData = ({ element }) => {
		return new Promise((resolve) => {
			if (element.children.length > 0) {
				resolve();
				return;
			}

			setData((value) => {
				const url = "https://drive.hackernwar.com/get_directory_child.php?p=" + element.name + "&id=" + element.id;
				let dat = [];
				fetch(url, {
					method: 'get'
				})
					.then(res => res.json())
					.then(data => {
						let dat = [];

						for (var i = 0; i < data.files.length; i++) {
							dat.push({
								name: data.files[i].name,
								children: [],
								id: value.length + dat.length,
								parent: element.id,
								isBranch: data.files[i].isBranch,
							})
						}
						updateTreeData(value, element.id, dat)
					})
					.catch(err => {
						// 
					});

			});

		});
	};

	const wrappedOnLoadData = async (props) => {
		const nodeHasNoChildData = props.element.children.length === 0;
		const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find(
			(e) => e.id === props.element.id
		);

		await onLoadData(props);

		if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
			const el = loadedAlertElement.current;
			setNodesAlreadyLoaded([...nodesAlreadyLoaded, props.element]);
			el && (el.innerHTML = `${props.element.name} loaded`);

			// Clearing aria-live region so loaded node alerts no longer appear in DOM
			setTimeout(() => {
				el && (el.innerHTML = "");
			}, 5000);
		}
	};

	return (
		<>
			<div>
				<div className="checkbox">
					<TreeView
						data={data}
						aria-label="Checkbox tree"
						onLoadData={wrappedOnLoadData}
						multiSelect
						propagateSelect
						togglableSelect
						propagateSelectUpwards
						nodeRenderer={({
							element,
							isBranch,
							isExpanded,
							isSelected,
							isHalfSelected,
							getNodeProps,
							level,
							handleSelect,
							handleExpand,
						}) => {
							const branchNode = (isExpanded, element) => {
								return isExpanded && element.children.length === 0 ? (
									<>
										<SpinnerCircularFixed size={16} thickness={200} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />
									</>
								) : (
									<ArrowIcon isOpen={isExpanded} />
								);
							};
							return (
								<div
									{...getNodeProps({ onClick: handleExpand })}
									style={{ paddingLeft: 15 * (level - 1) }}
								>
									{isBranch && branchNode(isExpanded, element)}
									<img src={isExpanded ? opened_directory : directory} alt="" />
									<span className="name">{element.name}</span>
								</div>
							);
						}}
					/>
				</div>
			</div>
		</>
	);
}

const ArrowIcon = ({ isOpen }) => {
	return <IoMdArrowDropright style={isOpen ? { "transform": "rotate(90deg)" } : null} className="tree-arrow" />;
};

function ExplorerPane(props) {
	return (
		<div className='pane'>

			{
				props.tree.length > 0
					? <MultiSelectCheckboxAsync
						data={props.tree}
					/>
					: <div className='center'>
						<SpinnerCircularFixed size={50} thickness={100} speed={100} color="rgba(130, 2, 130, 1)" secondaryColor="rgba(18, 18, 18, 1)" />
					</div>
			}

			<div className='footer'></div>

			<button className='pane-el' onClick={() => props.setModal('settings')}>
				<img
					src={settings}
					className='svg'
					alt="Paramètres"
				/>
				<span>Paramètres</span>
			</button>

			<button className='pane-el' onClick={() => props.setModal('storage')}>
				<img
					src={storage}
					className='svg'
					alt="Stockage"
				/>
				{
					props.storage === null || props.storage === undefined
					? <span>Stockage</span>
					: <span>Stockage • {sizeFormat(props.storage.usage)}</span>

				}
				
			</button>

		</div>
	);
};

export default ExplorerPane;