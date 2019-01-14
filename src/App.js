import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
// import Home from "./components/home/home.js";
import Tree from "./components/tree/tree.js";
import Modal from "./components/modal/modal.js";

class App extends Component {
  render() {
    return (
      <div className="hierarchy">
        <Router>
          <Switch>
	          <Route exact path="/" component={Tree} />
						<Route path="/taxon/:id" component={Modal} />
					</Switch>
        </Router>
      </div>
    );
  }
}

export default hot(module)(App);
