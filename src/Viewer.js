import React from 'react';
import { Link } from 'react-router-dom';
import Plyr from 'plyr';
import { sizeFormat, timeConverter } from './function';

import { viewerTypes, videoTypes } from './constants';

import back from './img/back.png';
import forward from './img/forward.png';

function getPos(file, files) {
	for (let i = 0; i < files.length; i++) {
		if (files[i].name == file.name) {
			return i;
		}
	}
}

function getPath(path, pos, files) {
	return `${path}/${files[pos].name}.${files[pos].type}`;
}

function Viewer(props) {
	const { path, file, files, base_url } = props;
	const filteredPos = files.filter(item => viewerTypes.includes(item.type) || videoTypes.includes(item.type));
	const pos = getPos(file, filteredPos);

	const [opacity, setOpacity] = React.useState(new Date().getTime());

	let timeout;

	function handleMove() {
		if (timeout) {
			clearTimeout(timeout);
		}
		setOpacity(1);
		timeout = setTimeout(() => {
			setOpacity(0);
		}, 5000);
	}

	// eslint-disable-next-line no-unused-vars
	const player = new Plyr('#player');

	return <div className='viewer' onMouseMove={handleMove} onMouseDown={handleMove}>
		{
			viewerTypes.includes(file.type) && <img
				className='img'
				src={`${base_url}get_content.php?p=${encodeURIComponent(`${file.path}/${file.name}.${file.type}`)}`}
			/>
		}
		{
			// eslint-disable-next-line react/no-unknown-property
			videoTypes.includes(file.type) && <video key={file.name} id='player' playsinline controls className='img'>
				<source src={`${base_url}get_video.php?p=${encodeURIComponent(`${file.path}/${file.name}.${file.type}`)}`} type='video/mp4' />
			</video>
		}
		{
			pos > 0 && <div className='back' style={{ opacity: opacity }}>
				<Link to={getPath(path, pos - 1, filteredPos)}>
					<img className='nav' src={back} />
				</Link>
			</div>
		}
		{
			pos < (filteredPos.length - 1) && <div className='forward' style={{ opacity: opacity }}>
				<Link to={getPath(path, pos + 1, filteredPos)}>
					<img className='nav' src={forward} />
				</Link>
			</div>
		}

		<div className={`info ${videoTypes.includes(file.type) && 'video'}`} style={{ opacity }}>
			<span>{file.name}.{file.type}</span>
			<br />
			<span>{timeConverter(file.time)} • {sizeFormat(file.size)}</span>
		</div>
	</div>;
}

export default Viewer;

