import React, { Component } from "react";
import "./search.sass";
import Modal from "../modal/modal.js";

function clearSearchResult(list) {
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
}

class Search extends Component {
	constructor(props) {
		super(props);
		this.timeout =  0;
	}

	handleLiClick = (e) => {
		this.props.toggleModal(e);

		setTimeout(function() {
			let ul = document.getElementById("search__result");

			clearSearchResult(ul);

			ul.parentNode.querySelector(".search__inner").value = "";
		}, 2000);
	}

	doSearch(evt){
    let query = evt.target.value;
		let minValueLength = 3;
		let ul = document.getElementById("search__result");

		clearSearchResult(ul);

		if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
			if (query.length >= minValueLength) {
				fetch(`https://biotax-api.herokuapp.com/api/search/${query}/10`)
					.then(data => data.json())
					.then(
						(data) => {
							for (let i = 0; i < data.length; i++) {
								let newLi = document.createElement('li');

								newLi.setAttribute("data-id", data[i].tsn);
								newLi.onclick = this.handleLiClick;
								newLi.innerHTML = data[i].title;

								ul.appendChild(newLi);
							}

						},
						(error) => {
							console.log("search error", error);
						}
					)
			}
    }, 2000);
  }

	render() {
		return (
			<div className={`search ${this.props.className}`}>
				<input
					type="search"
					name="search"
					className="search__inner"
					placeholder="Search for taxon..."
					onInput={(e) => this.doSearch(e)}
				/>
				<div className="search__icon" />
				<ul className="search__result" id="search__result"></ul>
			</div>
		);
	}
}

export default Search;
