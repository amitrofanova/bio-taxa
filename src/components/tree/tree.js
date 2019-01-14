import React, { Component } from "react";
import Home from "../home/home.js";

class Tree extends Component {
	constructor(props) {
    super(props);
    this.state = {
			error: null,
			isLoaded: false,
			rows: [
				{
					rank: "",
					items: [],
				}
			],
			activeTaxons: [],
		};
  }

	componentDidMount() {
		if (this.state.activeTaxons.length) {
			console.log("not king");
		} else {
			console.log("mounted, kings");
			fetch("https://biotax-api.herokuapp.com/api/kingdoms")
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: true,
							rows: [{rank: "Kingdom", items: result}],
						});
						console.log(this.state);
						console.log(result);
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
		const { error, isLoaded, rows, activeTaxons } = this.state;

		if (error) {
			return (
				<div className="modal">
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div style={ { margin: 10 } }>Error: {error.message}</div>;
					</div>
				</div>
			);
		} else if (!isLoaded) {
			return (
				<div className="modal">
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div style={ { margin: 10 } }>Loading...</div>
					</div>
				</div>
			);
		} else if (activeTaxons.length) {
			return (
				<div>
					{activeTaxons.map(i => (
						<div key={i} data-row={i} className="row" />
					))}
				</div>
			)
		}	else if (!activeTaxons.length){
			return (
				<Home data={rows[0].items}/>
			);
		}
	}
}

export default Tree;
