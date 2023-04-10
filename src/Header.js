
import React from 'react';
import { Link } from 'react-router-dom';

import del from './img/delete.svg';

// #005ba1

function Header({ path, isViewMode, setViewMode, uploading, uploadName, uploadPerc, uploadRemain }) {
	if (uploading === true) {
		return <>
			<div className='upload_header'>
				<div>
					Envoi de {uploadName}...
				</div>
				<div className='right'>
					<div>
						{Math.round(uploadPerc)} %
					</div>
					<div>
						{uploadRemain}
					</div>
				</div>
			</div>
			<div className='upload_perc' style={{ width: `${uploadPerc}%` }}></div>
		</>;
	}
	if (uploading === 'success') {
		return <>
			<div className='upload_header'>
				<div>
					Terminé !
				</div>
			</div>
			<div className='upload_success'></div>
		</>;
	}

	return <header style={{backgroundColor: isViewMode &&'#4f474e'}}>
		<div style={{
			width: '100px',
		}}>
			<Link to={'./'}>
				<img src='https://drive.hackernwar.com/view/img/ftp.png' alt='Logo' />
			</Link>
			<span className='title'>Drive</span>
		</div>
		{
			isViewMode &&
			<Link to={`${path}/`} className='viewer-back'>
				<img src={del} alt='Delete' className='svg_white' onClick={() => setViewMode(false)} />
			</Link>
		}
	</header>;
}

export default Header;