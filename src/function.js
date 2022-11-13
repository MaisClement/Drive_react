import React, { useState } from 'react';

function sizeFormat(bytes) {
	const kb = 1024;
	const mb = kb * 1024;
	const gb = mb * 1024;
	const tb = gb * 1024;

	if (bytes == null) {
		return '';

	} else if ((bytes >= 0) && (bytes < kb)) {
		return `${bytes} o`;

	} else if ((bytes >= kb) && (bytes < mb)) {
		return `${Math.round(bytes / kb)} Ko`;

	} else if ((bytes >= mb) && (bytes < gb)) {
		return `${Math.round(bytes / mb)} Mo`;

	} else if ((bytes >= gb) && (bytes < tb)) {
		return `${Math.round(bytes / gb)} Go`;

	} else if (bytes >= tb) {
		return `${Math.round(bytes / tb)} To`;

	} else {
		return `${bytes} o`;
	}
}

function timeConverter(timestamp) {
	var a = new Date(timestamp * 1000);
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var year = a.getFullYear() < 10 ? '0' + a.getFullYear() : a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
	var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
	var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
	return time;
}

function Toogle(props) {
	const [checked, setChecked] = useState(props.defaultChecked ?? false);

	function handleChange() {
		if (props.onChange !== undefined) {
			props.onChange(!checked);
		}
		setChecked(!checked);
	};

	return (
		<span>
			<span className={checked ? "toggle-control checked" : "toggle-control"} onClick={() => handleChange()}>
				<span className="control" />
			</span>
		</span>
	);
}

export {sizeFormat, Toogle, timeConverter};