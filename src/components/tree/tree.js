import React, { Component } from "react";
import Row from "../row/row.js";
import "./tree.sass";

class Tree extends Component {
  constructor(props) {
    //Выполнить вызов конструктора родительского класса
    //В конструкторе родительского класса могут выполняться некие операции по инициализации, результаты выполнения которых пригодятся и нашему объекту.
    super(props);

    this.state = {
      rows: [],
      error: false,
    };
  }

	fetchKingdoms = () =>  {
		fetch("https://biotax-api.herokuapp.com/api/kingdoms")
			.then(response => response.json())
			.then(
				data => {
					this.setState({
						rows: [{rank: "Kingdom", items: data}],
					});
				},
				error => {
					this.setState({
						error
					});
				}
			);
	}

  fetchChildrenFromNotLastRow = (taxonId, rowId) => {
    fetch(`https://biotax-api.herokuapp.com/api/children/${taxonId}`)
      .then(response => response.json())
      .then(
        data => {
          let rank = data.children[0].rank;
          let children = data.children;

          let newRowsArr = [...this.state.rows];
          newRowsArr.splice(rowId);
          newRowsArr.push({rank: rank, items: children});

          this.setState({
            rows: newRowsArr,
            error: false,
          });
        },
        error => {
          this.setState({
            error
          });
        }
      );
  }

	fetchChildrenFromLastRow = taxonId => {
		fetch(`https://biotax-api.herokuapp.com/api/children/${taxonId}`)
			.then(response => response.json())
			.then(
				data => {
					let rank = data.children[0].rank;
					let children = data.children;

					this.setState({
						rows: [...this.state.rows, {rank: rank, items: children}],
						error: false,
					});
				},
				error => {
					this.setState({
						error
					});
				}
			);
	}

  // setRowsState = childrenArrays => {
  //   fetch("https://biotax-api.herokuapp.com/api/kingdoms")
  //     .then(response => response.json())
  //     .then(
  //       data => {
  //         this.setState({
  //           rows: [{rank: "Kingdom", items: data}],
  //         });
  //
  //         for (let i = 0; i < childrenArrays.length; i++) {
  //           let childrenArray = childrenArrays[i];
  //           let rank = childrenArray[0].rank;
  //
  //           this.setState({
  //             rows: [...this.state.rows, {rank: rank, items: childrenArray}],
  //           });
  //         }
  //       },
  //       error => {
  //         this.setState({
  //           error
  //         });
  //       }
  //     );
  // }

	// fetchAllRowsByQuery = taxonParam => {
	// 	fetch(`https://biotax-api.herokuapp.com/api/taxon/${taxonParam}`)
	// 		.then(response => response.json())
	// 		.then(
	// 			data => {
	// 				let childrenArrays = [];
  //
	// 				let activeItems = data.ancestors;
	// 				activeItems.push(parseInt(taxonParam));
  //         console.log(activeItems);
  //
	// 				function getChildren(activeItems, childrenArrays, callback) {
	// 					const url = `https://biotax-api.herokuapp.com/api/children/${activeItems[0]}`;
  //           // document.querySelectorAll(`.card__inner[data-id="${activeItems[0]}"]`);
  //
	// 					fetch(url)
	// 						.then(data => data.json())
	// 						.then(
	// 							(data) => {
	// 								childrenArrays.push(data.children);
	// 								activeItems.shift();
  //
	// 								if (activeItems.length) {
	// 									getChildren(activeItems, childrenArrays, callback);
	// 								} else {
	// 									callback(childrenArrays);
	// 								}
	// 							}
	// 						);
	// 				}
  //
	// 				getChildren(activeItems, childrenArrays, this.setRowsState);
	// 			},
	// 			error => {
	// 				this.setState({
	// 					error
	// 				});
	// 			}
	// 		);
	// }

  // paintTree = (taxonParam, rowParam) => {
  //   // url contains taxonParam
  //   if (taxonParam) {
	// 		const rowsCount = this.state.rows.length;
  //
  //     // tree already contains rows
	// 		if (rowsCount) {
  //       // card on higher row has been clicked
  //       // need to remove all rows lower this row and add one children row
	// 			if (rowParam < rowsCount) {
	// 				let newRowsArr = [...this.state.rows];
  //
	// 				newRowsArr.splice(rowParam);
  //
	// 				this.setState({
	// 					rows: newRowsArr,
	// 				});
  //
	// 				this.fetchOneChildRow(taxonParam);
	// 			} else
	// 			// just add one row to the tree
  //       	this.fetchOneChildRow(taxonParam);
  //     } else
	// 			// url contains taxonParam but tree is empty (link was shared)
  //       this.fetchAllRowsByQuery(taxonParam);
  //   } else
	// 		// there are no url parameters, render home page
  //     this.fetchKingdoms();
  // };

  // updateUrl = (id, row) => {
  //   this.props.history.push(`?taxon=${id}&row=${row}`);
  // };

  repaintTree = (taxonId, rowId) => {
    const rowsCount = this.state.rows.length;

    if (rowId < rowsCount) {
      // card on higher row has been clicked;
      // need to remove all rows lower this row and add one children row
      this.fetchChildrenFromNotLastRow(taxonId, rowId);
    } else {
      // just add one row to the end of tree
      this.fetchChildrenFromLastRow(taxonId);
    }
  }

  componentDidMount() {
    this.fetchKingdoms();
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  render() {
    return (
      <div className="tree">
        {this.state.rows.map((row, i) => (
          <Row
            key={row.rank + i}
            rank={row.rank}
            data={row.items}
						row={i}
            repaintTree={this.repaintTree}
            toggleModal={this.props.toggleModal}
          />
        ))}
      </div>
    );
  }
}

export default Tree;
