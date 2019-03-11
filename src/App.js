import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
import Tree from "./components/tree/tree.js";
import Modal from "./components/modal/modal.js";

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);

  return {
    query: searchParams.get("taxon") || "",
    row: searchParams.get("row")
  };
}

// function setParams({ query }) {
//   const searchParams = new URLSearchParams();
//
//   searchParams.set("query", query || "");
//   return searchParams.toString();
// }

function MainPage(props) {

  function updateUrl(evt) {
    const url = evt.target.dataset.id;
    const row = parseInt(evt.target.dataset.row) + 1;

    props.history.push(`?taxon=${url}&row=${row}`);
  };

  return (
    <Tree query={props.query} onClick={updateUrl} />
  );
};

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
                const { query, row } = getParams(location);

                return <MainPage query={query} history={history} row={row}/>;
              }}
            />
					</Switch>
        </Router>
      </div>
    );
  }
}

export default hot(module)(App);
