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
            let rank = result.children[0].rank;
  					let children = result.children;

            this.setState({
              rows: [...this.state.rows, {rank: rank, items: children}],
              queryString: query,
              error: false,
            })

            const searchParams = new URLSearchParams();

            searchParams.set(rank, query || "");
            console.log(searchParams.toString());

            this.props.history.push(`?${rank}=${query}`);
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
    console.log("scu");
    console.log(this.state.rows);
    console.log(nextState.rows);
    return nextState.rows != this.state.rows;
  }

  componentWillReceiveProps(nextProps) {
    console.log("cwrp");
    console.log(this.props.query);
    console.log(this.state.queryString);
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
