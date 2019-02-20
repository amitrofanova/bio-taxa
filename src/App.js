import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {hot} from "react-hot-loader";
import "./App.sass";
// import Home from "./components/home/home.js";
// import Tree from "./components/tree/tree.js";
import Row from "./components/row/row.js";
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

  return (
    <div>
      <Tree history={history} query={query} />
    </div>
  );
};

class Tree extends Component {
  state = {
    queryString: "",
    rows: [
      {
        rank: "",
        items: [],
      }
    ],
    loading: false,
    error: false,
  }


  paintTree = query => {
    if (!query) {
      fetch("https://biotax-api.herokuapp.com/api/kingdoms")
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              // isLoaded: true,
              rows: [{rank: "Kingdom", items: result}],
              loading: false,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        )
    } else {
      const searchParams = new URLSearchParams();
      searchParams.set("query", query || "");

      this.setState({ loading: true, error: false });
      fetch(`https://biotax-api.herokuapp.com/api/children/${query}`)
        .then(res => res.json())
        .then((result) => {
          let rank = result.children[0].rank;
					let children = result.children;

          this.setState({
            rows: [...this.state.rows, {rank: rank, items: children}],
            loading: false
          })
        }
        )
        .catch(e => this.setState({ loading: false, error: true }));

        // const url = setParams({ query: this.state.queryString });
        this.props.history.push(`?query=${query}`);
    }
  };

  componentDidMount() {
    return this.paintTree(this.props.query);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      this.setState({ query: nextProps.query });
      return this.paintTree(nextProps.query);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="loading">Loading state: {this.state.loading.toString()} </div>
        <div className="error">Errror state: {this.state.error.toString()} </div>

        <div>
          {this.state.rows.map(i => (
            <Row
              key={i.rank}
              data={i.items}
              onClick={this.paintTree}
            />
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
