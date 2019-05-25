import React, { Component } from "react";
import "./search.sass";
import Modal from "../modal/modal.js";

// TODO: move to class?
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

	toggleInputStyle() {
		document.querySelector(".search__input").classList.toggle("search__input_active");
	}

	handleLiClick = (e) => {
		this.props.toggleModal(e);

		setTimeout(() => {
			let ul = document.getElementById("search__result");

			clearSearchResult(ul);

			ul.parentNode.querySelector(".search__input").value = "";

			this.toggleInputStyle();
		}, 1500);
	}

	doSearch = (evt) => {
		let minValueLength = 3;
    let query = evt.target.value;
		let ul = document.getElementById("search__result");
		let maxResultsNum = 12;

		clearSearchResult(ul);

		if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
			if (query.length >= minValueLength) {
				this.toggleInputStyle();

				fetch(`https://biotax-api.herokuapp.com/api/search/${query}/${maxResultsNum}`)
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
    }, 1500);
  }

	render() {
		return (
			<div className={`search ${this.props.className}`}>
				<input
					type="search"
					name="search"
					className="search__input"
					placeholder="Search for taxon..."
					onInput={this.doSearch}
				/>
				<div className="search__icon" />
				<ul className="search__result" id="search__result"></ul>
			</div>
		);
	}
}

export default Search;
