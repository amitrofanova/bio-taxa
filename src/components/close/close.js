import React, { Component } from 'react';
import "./close.sass";

function Close(props) {
	return <div className={`close ${props.className}`} onClick={props.onClick} ></div>
}

export default Close;
