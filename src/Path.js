import React from 'react';
import { Link } from 'react-router-dom';

function Path(props) {
	const path = props.path.split('/');
	return (
		<div className='path'>
			<Link to={'./'} className='path-link'>
				Accueil
			</Link>
			{
				props.path !== ''
					? <>
						{path.map(p => (
							<>
								<span className='path-space'>{'>'}</span>
								<Link to={props.path.substring(0, props.path.indexOf(p) + p.length + 1)} className='path-link'>
									{p}
								</Link>
							</>
						))}
					</>
					: null
			}
		</div>
	);
}
  

export default Path;