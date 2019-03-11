import React, { Component } from "react";
import Row from "../row/row.js";
import Card from "../card/card.js";

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItems: [],
      queryString: "",
			height: 0,
      rows: [],
      loading: false,
      error: false,
    };
  }

  showChildren = childrenArrays => {
    fetch("https://biotax-api.herokuapp.com/api/kingdoms")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            rows: [{rank: "Kingdom", items: result}],
          });

          for (let i = 0; i < childrenArrays.length; i++) {
            let childrenArray = childrenArrays[i];
            let rank = childrenArray[0].rank;

            this.setState({
              rows: [...this.state.rows, {rank: rank, items: childrenArray}],
            });
          }
        },
        (error) => {
          this.setState({
            error
          });
        }
      )
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
      if (this.state.rows.length) {
        fetch(`https://biotax-api.herokuapp.com/api/children/${query}`)
          .then(res => res.json())
          .then(
            (result) => {
              let rank = result.children[0].rank;
    					let children = result.children;

              this.setState({
                rows: [...this.state.rows, {rank: rank, items: children}],
                queryString: query,
								height: this.state.rows.length,
                error: false,
              });

              // const searchParams = new URLSearchParams();
              // searchParams.set("taxon", query || "");
              // this.props.history.push(`?mode=tree&taxon=${query}`);
            },
            (error) => {
              this.setState({
                error
              });
            }
          )
      } else {
        fetch(`https://biotax-api.herokuapp.com/api/taxon/${query}`)
          .then(data => data.json())
          .then(
            (data) => {
              let childrenArrays = [];

              let activeItems = data.ancestors;
              activeItems.push(parseInt(query));

              function getChildren(activeItems, childrenArrays, callback) {
                const url = `https://biotax-api.herokuapp.com/api/children/${activeItems[0]}`;

                fetch(url)
                  .then(data => data.json())
                  .then(
                    (data) => {
                      childrenArrays.push(data.children);
                      activeItems.shift();

                      if (activeItems.length) {
                				getChildren(activeItems, childrenArrays, callback);
                      } else {
                        callback(childrenArrays);
                      }
                    }
                  )
              }

              getChildren(activeItems, childrenArrays, this.showChildren);
            },
            (error) => {
              this.setState({
                error
              });
            }
          )
      }
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
        {this.state.rows.map((row, i) => (
          <Row
            key={row.rank}
            rank={row.rank}
            data={row.items}
						row={i}
            onClick={this.props.onClick}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default Tree;
