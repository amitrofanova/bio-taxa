import React, { Component } from "react";
import Home from "../home/home.js";

class Tree extends Component {
	constructor(props) {
    super(props);
    this.state = {
			rows: [
				{
					rank: "",
					items: [],
				}
			],
			activeTaxons: [],
			error: null,
			isLoaded: false,
		};
  }

	componentDidMount() {
		if (this.state.activeTaxons.length) {
			console.log("not king");
		} else {
			fetch("https://biotax-api.herokuapp.com/api/kingdoms")
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: true,
							rows: {rank: "Kingdom", items: [result]},
						});
					},
					(error) => {
						this.setState({
							isLoaded: true,
							error
						});
					}
				)
		}
	}

	handleClick() {

	}

	render() {
		const activeTaxons = this.state.activeTaxons;

		if (activeTaxons.length) {
			return (
				<div>
					{activeTaxons.map(i => (
						<div key={i} data-row={i} className="row" />
					))}
				</div>
			)
		}	else {
			return (
				<Home />
			);
		}
	}
}

export default Tree;
