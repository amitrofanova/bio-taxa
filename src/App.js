import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
import Row from "./components/row/row.js";
import Modal from "./components/modal/modal.js";

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);

  return {
    query: searchParams.get("query") || ""
  };
}

// function setParams({ query }) {
//   const searchParams = new URLSearchParams();
//
//   searchParams.set("query", query || "");
//   return searchParams.toString();
// }

const MainPage = props => {
  const { query, history } = props;

  return (
    <Tree history={history} query={query} />
  );
};

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryString: "",
      rows: [
        {
          rank: "",
          items: [],
        }
      ],
      loading: false,
      error: false,
    };
  }

  paintTree = query => {
    if (!query) {
      fetch("https://biotax-api.herokuapp.com/api/kingdoms")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              rows: [{rank: "Kingdom", items: result}],
            });
          },
          (error) => {
            this.setState({
              error
            });
          }
        )
    } else {
      fetch(`https://biotax-api.herokuapp.com/api/children/${query}`)
        .then(res => res.json())
        .then(
          (result) => {
            let parentRank = this.state.rows[this.state.rows.length - 1].rank;
            let childrenRank = result.children[0].rank;
  					let children = result.children;

            if (this.state.rows.length === 1) {
              this.setState({ queryString: `?Kingdom=${query}` });
            } else {
              this.setState({ queryString: this.state.queryString + `&${parentRank}=${query}` })
            }

            this.setState({
              rows: [...this.state.rows, {rank: childrenRank, items: children}],
              error: false,
            });
            console.log(this.state);

            const searchParams = new URLSearchParams();

            searchParams.set(parentRank, query || "");

            this.props.history.push(this.state.queryString);
          },
          (error) => {
            this.setState({
              error
            });
          }
        )
    }
  };

  componentDidMount() {
    return this.paintTree(this.props.query);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.rows != this.state.rows;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      return this.paintTree(nextProps.query);
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.state.rows.map(row => (
          <Row
            key={row.rank}
            rank={row.rank}
            data={row.items}
            onClick={this.paintTree}
          />
        ))}
      </React.Fragment>
    );
  }
}

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
                const { query } = getParams(location);

                return <MainPage query={query} history={history} />;
              }}
            />
					</Switch>
        </Router>
      </div>
    );
  }
}

export default hot(module)(App);
