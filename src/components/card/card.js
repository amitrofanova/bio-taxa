import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./card.sass";

class Card extends Component {
	constructor(props) {
    super(props);
    this.state = {
		};
  }

	render() {
		return (
			<div className="card">
				<Link
					to={{
						pathname: `/taxon/${this.props.id}`
					}}
					className="card__inner"
				>
					<div className="card__title">
						{this.props.title}
					</div>

					<div className="card__img">
						<img src="https://via.placeholder.com/150" alt="testimg" />
					</div>

					<div className="card__description">
						{this.props.description} description
					</div>
				</Link>

				<div className="card__controllers">
					<div className="card__wiki-btn">
						<img src="https://via.placeholder.com/15" alt="read on wikipedia" />
					</div>

					<div
						data-id={this.props.id}
						className="card__hierarchy-btn"
						onClick={this.props.handleHierarchyClick}
					>
						<img src="https://via.placeholder.com/15" alt="hierarchy" />
					</div>
				</div>
			</div>
		);
	}
}

export default Card;
