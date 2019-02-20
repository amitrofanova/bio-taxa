import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
// import Home from "./components/home/home.js";
// import Tree from "./components/tree/tree.js";
import Card from "./components/card/card.js";
import Modal from "./components/modal/modal.js";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
			error: null,
			isLoaded: false,
			rows: [
				{
					rank: "",
					items: [],
				}
			],
			activeTaxons: [],
		};
  }

  handleHierarchyClick() {

  }

  componentDidMount() {
    fetch("https://biotax-api.herokuapp.com/api/kingdoms")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            rows: [{rank: "Kingdom", items: result}],
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
    const { error, isLoaded, rows, activeTaxons } = this.state;

    return (
      <div className="row row_first">
        {rows[0].items.map(i => (
          <Card
            key={i.id}
            id={i.id}
            title={i.title}
            description={i.description}
            handleHierarchyClick={(e) => this.handleHierarchyClick(e)}
          />
        ))}
      </div>
    )
  }
}

function getParams(location) {
  const searchParams = new URLSearchParams(location.search);

  console.log("searchParams from getParams function: ", searchParams.get("query"));
  return {
    query: searchParams.get("query") || ""
  };
}

function setParams({ query }) {
  const searchParams = new URLSearchParams();

  searchParams.set("query", query || "");
  return searchParams.toString();
}

const MainPage = props => {
  const { query, history } = props;

  console.log("mainPage props: ", props);
  return (
    <div>
      <Tree history={history} query={query} />
      <h2>{`My query: ${query}`}</h2>
    </div>
  );
};

class Tree extends Component {
  state = { queryString: "", results: [], loading: false, error: false }

  updateQueryString = e => this.setState({ queryString: e.target.value });

  updateURL = () => {
    const url = setParams({ query: this.state.queryString });
    console.log("queryString: ", this.state.queryString);
    this.props.history.push(`?${url}`);
  };

  searchChildren = query => {
    if (!query) {
      return this.setState({
        results: []
      });
    }

    this.setState({ loading: true, error: false });
    fetch(`https://biotax-api.herokuapp.com/api/children/${query}`)
      .then(res => res.json())
      .then((data) => {
        console.log("query: ", query);
        console.log("fetching... ", data);
        this.setState({
          results: data.children,
          loading: false
        })
      }
      )
      .catch(e => this.setState({ loading: false, error: true }));

      const url = setParams({ query: this.state.queryString });
      console.log("queryString: ", this.state.queryString);
      this.props.history.push(`?${url}`);

  };

  componentDidMount() {
    return this.searchChildren(this.props.query);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({ query: nextProps.query });
      return this.searchChildren(nextProps.query);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="search">
          <input
            type="text"
            className="input"
            placeholder="What am I looking for ?"
            value={this.state.queryString}
            onChange={this.updateQueryString}
          />
          <input
            type="button"
            className="button"
            value="Search"
            onClick={() => this.searchChildren(this.state.queryString)}
          />
        </div>
        <br/>
        <div className="loading">Loading state: {this.state.loading.toString()} </div>
        <div className="error">Errror state: {this.state.error.toString()} </div>
        <div>
          {this.state.results.map(child => (
            <div className="child" key={child.id}>
              <a className="child-link">
                {child.name}
              </a>
              <div className="child-owner">{`by ${child.rank}`}</div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="hierarchy">
        <Router>
          <Switch>
						<Route path="/taxon/:id" component={Modal} />
            <Route
              path="/"
              render={({ location, history }) => {
                const { query } = getParams(location);

                if (query) {
                  return <MainPage query={query} history={history} />;
                } else {
                  return <Home />
                }

              }}
            />
					</Switch>
        </Router>
      </div>
    );
  }
}

export default hot(module)(App);
