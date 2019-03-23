import React, { Component } from "react";
import Row from "../row/row.js";

class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      error: false,
    };
  }

  updateUrl = (evt) => {
    const url = evt.target.dataset.id;
    const activeRow = parseInt(evt.target.dataset.row) + 1;

    this.props.history.push(`?taxon=${url}&row=${activeRow}`);
  };

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

	fetchOneChildRow = taxonParam => {
		fetch(`https://biotax-api.herokuapp.com/api/children/${taxonParam}`)
			.then(res => res.json())
			.then(
				(result) => {
					let rank = result.children[0].rank;
					let children = result.children;

					this.setState({
						rows: [...this.state.rows, {rank: rank, items: children}],
						queryString: taxonParam,
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

	fetchAllRowsByQuery = taxonParam => {
		fetch(`https://biotax-api.herokuapp.com/api/taxon/${taxonParam}`)
			.then(data => data.json())
			.then(
				(data) => {
					let childrenArrays = [];

					let activeItems = data.ancestors;
					activeItems.push(parseInt(taxonParam));

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

  paintTree = (taxonParam, rowParam) => {
    // url contains taxonParam
    if (taxonParam) {
			const rowsCount = this.state.rows.length;

      // tree already contains rows
			if (rowsCount) {
        // card on higher row has been clicked
        // need to remove all rows lower this row and add one children row
				if (rowParam < rowsCount) {
					let newRowsArr = [...this.state.rows];

					newRowsArr.splice(rowParam);

					this.setState({
						rows: newRowsArr,
					});

					this.fetchOneChildRow(taxonParam);
				} else
				// just add one row to the tree
        	this.fetchOneChildRow(taxonParam);
      } else
				// url contains taxonParam but tree is empty (link was shared)
        this.fetchAllRowsByQuery(taxonParam);
    } else
			// there are no url parameters, render home page
      this.fetchKingdoms();
  };

  componentDidMount() {
    return this.paintTree(this.props.taxonParam, this.props.rowParam);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taxonParam !== this.props.taxonParam) {
      return this.paintTree(nextProps.taxonParam, nextProps.rowParam);
    }
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
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
            onClick={this.updateUrl}
          />
        ))}
      </React.Fragment>
    );
  }
}

export default Tree;
