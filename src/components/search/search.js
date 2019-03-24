import React, { Component } from "react";
import "./search.sass";

function Search(props) {
	return (
		<div className={`search ${props.className}`}>
			<input
				type="search"
				name="search"
				className="search__inner"
				placeholder="Search for taxon..."
			/>
			<div className="search__icon" />
		</div>
	);
}

export default Search;
