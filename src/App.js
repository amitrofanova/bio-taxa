import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
import Row from "./components/row/row.js";
import Modal from "./components/modal/modal.js";

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);

  return {
    query: searchParams.get("taxon") || ""
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
    <div>
      <InputPage history={history} />
      <h2>{`My query: ${query}`}</h2>
      <ResultsPage query={query} />
    </div>
  );
};

class InputPage extends React.Component {
  state = { inputValue: "" };
  updateInputValue = (evt) => {
    this.setState({ inputValue: evt.target.value });
    console.log(this.state);
  }
  updateUrl = (evt) => {
    const url = evt.target.value;
    console.log("upd");
    this.props.history.push(`?${url}`);
  };
  render() {
    return (
      <div>
        <input
          name="inputSearch"
          id="search"
          type="text"
          className="input"
          placeholder="What am I looking for ?"
          value={this.state.inputValue}
          onChange={(evt) => this.updateInputValue(evt)}
        />
      </div>
    );
  }
}

class ResultsPage extends Component {
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
    console.log(query);

    if (!query) {
      fetch("https://biotax-api.herokuapp.com/api/kingdoms")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              rows: [{rank: "Kingdom", items: result}],
            });
            console.log(this.state);
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
            });
            document.getElementById("search").value = query;

            // const searchParams = new URLSearchParams();
            //
            // searchParams.set("taxon", query || "");

            // this.props.history.push(`?mode=tree&taxon=${query}`);
            console.log(this.state);
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps != this.props;
  // }

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
