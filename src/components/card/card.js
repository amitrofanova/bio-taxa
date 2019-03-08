import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./card.sass";
import WikiIcon from "../../resources/images/wiki-icon.svg";
import HierarchyIcon from "../../resources/images/hierarchy-icon.png";

function Card(props) {
	return (
		<div className="card">
			<Link to={`/taxon/${props.id}`} className="card__inner">
				<div className={props.image ? "card__title" : "card__title_no-img"}>
					{props.title || props.name}
				</div>

				{props.image &&
					<div className="card__img">
						<img src={`${props.image}`} alt={`${props.name}`} />
					</div>
				}

				<div className="card__description">
					{props.description} description
				</div>
			</Link>

			<div className="card__controllers">
				<div className="card__wiki-btn">
					<img src={WikiIcon} alt="read on wikipedia" />
				</div>

				<div
					data-id={props.id}
					className="card__hierarchy-btn"
					onClick={(evt) => props.onClick(evt)}
				>
					<img src={HierarchyIcon} alt="hierarchy" />
				</div>
			</div>
		</div>
	);
}

export default Card;
