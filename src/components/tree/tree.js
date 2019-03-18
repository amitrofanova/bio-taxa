import React, { Component } from "react";
import Row from "../row/row.js";
import Card from "../card/card.js";

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      error: false,
    };
  }

  setRowsState = childrenArrays => {
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
      );
  }

	fetchKingdoms = () =>  {
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
			);
	}

	fetchOneChildRow = query => {
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
				},
				(error) => {
					this.setState({
						error
					});
				}
			);
	}

	fetchAllRowsByQuery = query => {
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
							);
					}

					getChildren(activeItems, childrenArrays, this.setRowsState);
				},
				(error) => {
					this.setState({
						error
					});
				}
			);
	}

  paintTree = (query, row) => {
    if (query) {
			// url contains query
			const rowsCount = this.state.rows.length;

			if (rowsCount) {
				// tree already contains rows
				if (row < rowsCount) {
					// card on higher row has been clicked
					// need to remove all rows lower this row and add one children row
					let newRowsArr = [...this.state.rows];

					newRowsArr.splice(row);

					this.setState({
						rows: newRowsArr,
					});

					this.fetchOneChildRow(query);
				} else
				// just add one row to the tree
        	this.fetchOneChildRow(query);
      } else
				// url contains query but tree is empty (link was shared)
        this.fetchAllRowsByQuery(query);
    } else
			// there are no url parameters, render home page
      this.fetchKingdoms();
  };

  componentDidMount() {
    return this.paintTree(this.props.query, this.props.row);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query) {
      return this.paintTree(nextProps.query, nextProps.row);
    }
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
    console.log("componentDidUpdate");
  }

  render() {
    return (
      <React.Fragment>
        {this.state.rows.map((row, i) => (
          <Row
            key={row.rank + i}
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
