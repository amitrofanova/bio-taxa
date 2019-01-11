import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Thumbnail({ title }) {
  return (
    <div>
			{title}
    </div>
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
							<Thumbnail title={i.title} />
							<p>{i.description}</p>
						</Link>
					))}
				</div>
			);
		}
	}
}

export default Home;
