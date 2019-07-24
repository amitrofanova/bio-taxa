import React, { Component } from "react";
import "./search.sass";
import Modal from "../modal/modal.js";

document.addEventListener("click", function(e) {
	const $resultList = document.querySelector("#search__result");

	if (e.target.closest("#search__result")) return;

	while ($resultList.firstChild) {
		$resultList.removeChild($resultList.firstChild);
	}
});

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

	toggleResultList = () => {
		document.querySelector(".search__input").classList.toggle("search__input_active");
	}

	handleLiClick = (e) => {
		this.props.toggleModal(e);

		setTimeout(() => {
			let ul = document.getElementById("search__result");

			clearSearchResult(ul);

			ul.parentNode.querySelector(".search__input").value = "";

			this.toggleResultList();
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
				this.toggleResultList();

				fetch(`https://biotax-api.herokuapp.com/api/search/${query}/${maxResultsNum}`)
					.then(response => response.json())
					.then(
						data => {
							if (data.length === 0) {
								let listItem = document.createElement("li");

								listItem.innerHTML = "No results found";
								listItem.classList.add("search__no-result");

								ul.appendChild(listItem);
							}

							if (data.length > 0) {
								for (let i = 0; i < data.length; i++) {
									let listItem = document.createElement("li");

									listItem.setAttribute("data-id", data[i].tsn);
									listItem.onclick = this.handleLiClick;
									listItem.innerHTML = data[i].title;
									listItem.classList.add("search__list-item");

									ul.appendChild(listItem);
								}
							}
						},
						error => {
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
