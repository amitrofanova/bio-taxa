import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
import Tree from "./components/tree/tree.js";
import Modal from "./components/modal/modal.js";
import Header from "./components/header/header.js";

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
      <div className="application">
        <Router>
          <Switch>
						<Route path="/taxon/:id" component={Modal} />
            <Route
              path="/"
              render={({ location, history }) => {
                const { taxonParam, rowParam } = getParams(location);

                return (
                  <React.Fragment>
                    <Header />
                    <Tree taxonParam={taxonParam} rowParam={rowParam} history={history} />
                  </React.Fragment>
                );
              }}
            />
					</Switch>
        </Router>
      </div>
    );
  }
}

export default hot(module)(App);
