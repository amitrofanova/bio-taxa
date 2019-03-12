import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./card.sass";
// import WikiIcon from "../../resources/images/wiki-icon.svg";
// import HierarchyIcon from "../../resources/images/hierarchy-icon.png";

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
					{props.description || "Taxon has no description"}
				</div>
			</Link>

			<div className="card__controllers">
				<div className="card__wiki-btn">
				</div>

				<div
					data-id={props.id}
					data-row={props.row}
					className="card__hierarchy-btn"
					onClick={(evt) => props.onClick(evt)}
				>
				</div>
			</div>
		</div>
	);
}

export default Card;
