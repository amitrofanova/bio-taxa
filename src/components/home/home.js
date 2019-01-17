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
					<Card
						key={i.id}
						id={i.id}
						title={i.title}
						description={i.description}
						onClick={() => this.props.onClick(i)}
					/>
				))}
			</div>
		);
	}
}

export default Home;
