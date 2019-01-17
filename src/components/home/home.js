import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Card from "../card/card.js";
import "./home.sass";

function Home(props) {
	return (
		<div className="row row_first">
			{props.data.map(i => (
				<Card
					key={i.id}
					id={i.id}
					title={i.title}
					description={i.description}
					onClick={() => props.onClick(i)}
				/>
			))}
		</div>
	);
}

export default Home;
