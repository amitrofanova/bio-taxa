import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Card from "../card/card.js";
import "./home.sass";

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		return (
			<div className="row row_first">
				{this.props.data.map(i => (
					<Link
						key={i.id}
						to={{
							pathname: `/taxon/${i.id}`
						}}
						className="card"
					>
						<Card
							title={i.title}
							description={i.description}
						/>
					</Link>
				))}
			</div>
		);
	}
}

export default Home;
