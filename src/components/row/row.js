import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Card from "../card/card.js";
import "./row.sass";

function Row(props) {
	return (
		<div className="row">
			<div className="row__rank">{props.rank}</div>

			<div className="row__cards" data-rank={props.rank}>
				{props.data.map(i => (
					<Card
						key={i.id}
						id={i.id}
						name={i.name}
						image={i.image_url}
						title={i.title}
						description={i.description}
						url={i.url}
						childrenCount={i.total_children}
						row={props.row}
						updateUrl={props.updateUrl}
						toggleModal={props.toggleModal}
						transformNotChoisenSiblings={props.transformNotChoisenSiblings}
					/>
				))}
			</div>
		</div>
	)
}

export default Row;
