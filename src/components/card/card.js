import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./card.sass";

class Card extends Component {
	constructor(props) {
    super(props);
    this.state = {
			active: false,
		};
  }

	render() {
		return (
			<div className="card" data-id={this.props.id}>
				<a href="#" className="card__inner">
					<div className="card__title">
						{this.props.title}
					</div>

					<div className="card__img">
						<img src="https://via.placeholder.com/150" alt="testimg" />
					</div>

					<div className="card__description">
						{this.props.description} description
					</div>
				</a>

				<div className="card__controllers">
					<a className="card__wiki-btn" href="#" target="_blank">
						<img src="https://via.placeholder.com/15" alt="read on wikipedia" />
					</a>

					<div className="card__hierarchy-btn">
						<img src="https://via.placeholder.com/15" alt="hierarchy" />
					</div>
				</div>
			</div>
		)
	}
}

export default Card;
