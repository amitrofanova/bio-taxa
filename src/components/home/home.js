import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Card from "../card/card.js";
import "./home.sass";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			data: []
		}
	}

	componentDidMount() {
		fetch("https://biotax-api.herokuapp.com/api/kingdoms")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						data: result
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
		const { error, isLoaded, data } = this.state;

		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<main className="hierarchy">
					{data.map(i => (
						<Link
							key={i.id}
							to={{
								pathname: `/taxon/${i.id}`,
								// this is the trick!
								state: { modal: true }
							}}
							className="card"
						>
							<Card
								title={i.title}
								description={i.description}
							/>
						</Link>
					))}
				</main>
			);
		}
	}
}

export default Home;
