import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
import Home from "./components/home/home.js";
import Modal from "./components/modal/modal.js";

class ModalSwitch extends React.Component {
	constructor(props) {
    super(props);
    this.state = {data: []};
  }
	previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    let { location } = this.props;

		console.log("location...", location);

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    let { location } = this.props;

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return (
      <React.Fragment>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={Home} />
					// FIXME: /taxon/:id doesn't render Modal
					<Route path="/taxon/:id" component={Modal} />
        </Switch>
        {isModal ?
					<Route
						path="/taxon/:id"
						component={Modal}
					/> : null}
      </React.Fragment>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route component={ModalSwitch} />
        </Router>
      </div>
    )
  }
}

export default hot(module)(App);
