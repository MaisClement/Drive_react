/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { IoMdArrowDropright } from 'react-icons/io';
import { SpinnerCircularFixed } from 'spinners-react';
import { Toogle, sizeFormat } from './function';

import directory from './img/directory.png';
import opened_directory from './img/opened_directory.png';

function Tree({ tree, path, updateTree }) {
	function updateTreeItem(value) {
		updateTree(value);
	}
	return tree.map((item, index) => <TreeItem key={item.name} item={item} index={index} path={path} updateTreeItem={updateTreeItem} />);
}

function TreeItem({ item, index, path, updateTreeItem }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	function updateTree(value) {
		updateTreeItem({ [index]: { 'children': value } });
	}

	async function toggle() {
		if (!item.isBranch) {
			return;
		}
		if (item.children.length === 0) {
			await getChild(item.path);
		}
		setIsExpanded(!isExpanded);
	}

	function getChild(name) {
		setIsLoading(true);
		const url = 'https://drive.hackernwar.com/get_directory.php?p=' + encodeURIComponent(name);
		fetch(url, {
			method: 'get'
		})
			.then(res => res.json())
			.then(data => {
				updateTreeItem({ [index]: { 'children': { $set: data.folders } } });
				setIsLoading(false);
				setIsExpanded(true);
			})
			.catch(() => {
				// 
			});
	}

	const isSelected = useLocation().pathname === `${path}/${item.name}`;
	
	return <div key={item.name}>
		<div className={`tree-node ${!item.isBranch && 'tree-nochild'}  ${isSelected && 'current'}`}>
			<div className='is-flex' onClick={toggle}>
				{
					item.isBranch && isLoading &&
					<SpinnerCircularFixed size={16} thickness={200} speed={100} color='rgba(130, 2, 130, 1)' secondaryColor='rgba(18, 18, 18, 1)' />
				}
				{
					item.isBranch && !isLoading &&
					<ArrowIcon isOpen={isExpanded} />
				}
				<img src={isExpanded ? opened_directory : directory} alt='' />
			</div>
			<Link to={`${path}/${item.name}`} className='tree-link'>
				<span className='name'>{item.name}</span>
			</Link>
		</div>
		{
			(isExpanded && item.children.length > 0) && <div className='tree-child'><Tree tree={item.children} updateTree={updateTree} path={`${path}/${item.name}`}  /></div>
		}
	</div>;
}

const ArrowIcon = ({ isOpen }) => {
	return <IoMdArrowDropright style={isOpen ? { 'transform': 'rotate(90deg)' } : null} className='tree-arrow' />;
};

export default Tree;