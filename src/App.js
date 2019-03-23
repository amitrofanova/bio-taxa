import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
import Tree from "./components/tree/tree.js";
import Modal from "./components/modal/modal.js";

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);

  return {
    taxonParam: searchParams.get("taxon") || "",
    rowParam: searchParams.get("row")
  };
}

// function setParams({ query }) {
//   const searchParams = new URLSearchParams();
//
//   searchParams.set("query", query || "");
//   return searchParams.toString();
// }

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
						<Route path="/taxon/:id" component={Modal} />
            <Route
              path="/"
              render={({ location, history }) => {
                const { taxonParam, rowParam } = getParams(location);

                return <Tree taxonParam={taxonParam} rowParam={rowParam} history={history} />;
              }}
            />
					</Switch>
        </Router>
      </div>
    );
  }
}

export default hot(module)(App);
