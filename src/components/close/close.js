import React, { Component } from 'react';
import "./close.sass";

function Close(props) {
	return <button type="button" className={`close ${props.className}`} onClick={props.onClick} ></button>
}

export default Close;
