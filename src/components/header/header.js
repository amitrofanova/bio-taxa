import React, { Component } from "react";
import Search from "../search/search.js";
import "./header.sass";

function Header(props) {
	return (
		<div className="header">
			<Search className="header__search" />
		</div>
	);
}

export default Header;
