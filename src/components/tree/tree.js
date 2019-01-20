import React, { Component } from "react";
import Card from "../card/card.js";

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
		let activeTaxons = this.state.activeTaxons;
		let num = activeTaxons.length;

		if (activeTaxons.length) {
			console.log("not king");
			fetch(`https://biotax-api.herokuapp.com/api/children/${activeTaxons[num]}`)
				.then(res => res.json())
				.then(
					(result) => {
						this.setState({
							isLoaded: true,
							rows: [{rank: activeTaxons[num].children[0].rank, items: result.children}],
						});
					},
					(error) => {
						this.setState({
							isLoaded: true,
							error
						});
					}
				)
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

	handleHierarchyClick(e) {
		console.log("click");
	}

	render() {
		const { error, isLoaded, rows, activeTaxons } = this.state;

		if (error) {
			return (
				<div className="modal">
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div style={ { margin: 10 } }>Error: {error.message}</div>
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
				<div className="row row_first">
					{rows[0].items.map(i => (
						<Card
							key={i.id}
							id={i.id}
							title={i.title}
							description={i.description}
							handleHierarchyClick={() => this.handleHierarchyClick()}
						/>
					))}
				</div>
			);
		}
	}
}

export default Tree;
