import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Card from "../card/card.js";
import "./row.sass";

function Row(props) {
	const cardComponents = props.data.map(card => {
		return (
			<Card
				key={card.id}
				id={card.id}
				name={card.name}
				image={card.image_url}
				title={card.title}
				description={card.description}
				url={card.url}
				childrenCount={card.total_children}
				row={props.row}
				// updateUrl={props.updateUrl}
				repaintTree={props.repaintTree}
				toggleModal={props.toggleModal}
				transformNotChoisenSiblings={props.transformNotChoisenSiblings}
			/>
		)
	});

	return (
		<div className="row">
			<div className="row__rank">{props.rank}</div>

			<div className="row__cards" data-rank={props.rank}>
				{cardComponents}
			</div>
		</div>
	)
}

export default Row;
