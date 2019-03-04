import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./card.sass";

function Card(props) {
	return (
		<div className="card">
			<div className="card__inner">
				<div className="card__title">
					{props.title}
				</div>

				<div className="card__img">
					<img src="https://via.placeholder.com/150" alt="testimg" />
				</div>

				<div className="card__description">
					{props.description} description
				</div>
			</div>

			<div className="card__controllers">
				<div className="card__wiki-btn">
					<img src="https://via.placeholder.com/15" alt="read on wikipedia" />
				</div>

				<div
					data-id={props.id}
					className="card__hierarchy-btn"
					onClick={(evt) => props.onClick(evt)}
				>
					<img src="https://via.placeholder.com/15" alt="hierarchy" />
				</div>
			</div>
		</div>
	);
}

export default Card;
