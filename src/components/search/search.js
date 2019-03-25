import React, { Component } from "react";
import "./search.sass";

class Search extends Component {
	constructor(props) {
		super(props);
		this.timeout =  0;
	}

	doSearch(evt){
    var query = evt.target.value;

		if (query) {
			if (this.timeout) clearTimeout(this.timeout);

	    this.timeout = setTimeout(() => {
				fetch(`https://biotax-api.herokuapp.com/api/search/${query}/10`)
					.then(data => data.json())
					.then(
						(data) => {
							console.log(data);
							for (let i = 0; i < data.length; i++) {
								var newLi = document.createElement('li');
								newLi.innerHTML = data[i].title;

								document.getElementById("search__result").appendChild(newLi);
							}

						},
						(error) => {
							console.log("search error");
						}
					)
	    }, 1000);
		}
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