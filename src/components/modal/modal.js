import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const IMAGES = [
  { id: 0, title: "Dark Orchid", color: "DarkOrchid" },
  { id: 1, title: "Lime Green", color: "LimeGreen" },
  { id: 2, title: "Tomato", color: "Tomato" },
  { id: 3, title: "Seven Ate Nine", color: "#789" },
  { id: 4, title: "Crimson", color: "Crimson" }
];

class Modal extends Component {
	constructor(props) {
    super(props);
    this.state = {data: []};
  }
	render() {
		let taxonId = this.props.match.params.id;

		if (!taxonId) return null;

		let back = e => {
			e.stopPropagation();
			this.props.history.goBack();
		};

		return (
			<div
				onClick={back}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					background: "rgba(0, 0, 0, 0.15)"
				}}
			>
				<div
					className="modal"
					style={{
						position: "absolute",
						background: "#fff",
						top: 25,
						left: "10%",
						right: "10%",
						padding: 15,
						border: "2px solid #444"
					}}
				>
					<h1>{taxonId}</h1>
					<button type="button" onClick={back}>
						Close
					</button>
				</div>
			</div>
		);
	}

}

export default Modal;
