import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Card from "../card/card.js";

function Row(props) {
	return (
		<div className="row" data-rank={props.rank}>
			{props.data.map(i => (
				<Card
					key={i.id}
					id={i.id}
					title={i.title}
					description={i.description}
					handleHierarchyClick={props.onClick}
				/>
			))}
		</div>
	)
}

export default Row;
