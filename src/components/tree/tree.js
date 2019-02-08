import React, { Component } from "react";
import Row from "../row/row.js";
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

	shouldComponentUpdate(){
     console.log("shouldComponentUpdate()", this.state);
     return true;
 }
 componentWillUpdate(){
     console.log("componentWillUpdate()", this.state);
 }
 componentDidUpdate(){
     console.log("componentDidUpdate()", this.state);
 }

	handleHierarchyClick(e) {
		let taxonId = e.target.dataset.id;
		console.log("taxonId: ", taxonId);
		console.log("state: ", this.state);

		fetch(`https://biotax-api.herokuapp.com/api/children/${taxonId}`)
			.then(res => res.json())
			.then(
				(result) => {
					let rank = result.children[0].rank;
					let children = result.children;

					this.setState({
						isLoaded: true,
						rows: [...this.state.rows, {rank: rank, items: children}],
						activeTaxons: [...this.state.activeTaxons, taxonId]
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
		} else {
			if (!activeTaxons.length) {
				return (
					<div className="row row_first">
						{rows[0].items.map(i => (
							<Card
								key={i.id}
								id={i.id}
								title={i.title}
								description={i.description}
								handleHierarchyClick={(e) => this.handleHierarchyClick(e)}
							/>
						))}
					</div>
				);
			} else {
				return (
					<div>
						{rows.map(i => (
							<Row
								key={i.rank}
								data={i.items}
								handleHierarchyClick={(e) => this.handleHierarchyClick(e)}
							/>
						))}
					</div>
				)
			}
		}
	}
}

export default Tree;
