import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const IMAGES = [
  { id: 0, title: "Dark Orchid", color: "DarkOrchid" },
  { id: 1, title: "Lime Green", color: "LimeGreen" },
  { id: 2, title: "Tomato", color: "Tomato" },
  { id: 3, title: "Seven Ate Nine", color: "#789" },
  { id: 4, title: "Crimson", color: "Crimson" }
];

function Thumbnail({ background }) {
  return (
    <div
      style={{
        width: 50,
        height: 50,
        background: background
      }}
    />
  );
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			data: []
		}
	}

	componentDidMount() {
		fetch("https://biotax-api.herokuapp.com/api/kingdoms")
			.then(res => res.json())
			.then(
				(result) => {
					console.log("mount hierarchy... ", result);
					this.setState({
						isLoaded: true,
						data: result
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
	}

	render() {
		const { error, isLoaded, data } = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					{data.map(i => (
						<Link
							key={i.id}
							to={{
								pathname: `/img/${i.id}`,
								// this is the trick!
								state: { modal: true }
							}}
						>
							<Thumbnail background={i.image_url} />
							<p>{i.title}</p>
						</Link>
					))}
				</div>
			);
		}
	}
}

export default Home;
