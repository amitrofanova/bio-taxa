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

  updateUrl = (id, row) => {
    this.props.history.push(`?taxon=${id}&row=${row}`);
  };

  styleCards = $selectedCard => {
    let $cardsInRow = $selectedCard.parentElement.children;
    let $siblings = [...$cardsInRow].filter(c=>c!=$selectedCard);
    let cardsInRowCount = $cardsInRow.length;
    let selectedCardNum = Array.prototype.indexOf.call($cardsInRow, $selectedCard);
    const middleCardNum = Math.floor(cardsInRowCount / 2);

    if ((cardsInRowCount % 2) === 0) {
      let emptyCard = document.createElement("div");
      emptyCard.classList.add("card");
      emptyCard.style.visibility = "hidden";

      $selectedCard.parentElement.appendChild(emptyCard);
      cardsInRowCount += 1;
    }

    for (let i = 0; i < cardsInRowCount; i++) {
      if (i === selectedCardNum) {
        $cardsInRow[i].style.order = middleCardNum;
      } else if (i === middleCardNum) {
        $cardsInRow[i].style.order = selectedCardNum;
      } else {
        $cardsInRow[i].style.order = i;
      }
    }


    if ($selectedCard.classList.contains("card__inactive")) {
      $selectedCard.classList.remove("card__inactive");
      $selectedCard.classList.add("card_active");
    }

    for (let i = 0; i < $siblings.length; i++) {
      $siblings[i].classList.add("card__inactive");
    }

  }

  setRowsState = childrenArrays => {
    fetch("https://biotax-api.herokuapp.com/api/kingdoms")
      .then(response => response.json())
      .then(
        data => {
          this.setState({
            rows: [{rank: "Kingdom", items: data}],
          });

          for (let i = 0; i < childrenArrays.length; i++) {
            let childrenArray = childrenArrays[i];
            let rank = childrenArray[0].rank;

            this.setState({
              rows: [...this.state.rows, {rank: rank, items: childrenArray}],
            });
          }
        },
        error => {
          this.setState({
            error
          });
        }
      );
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

	fetchChildrenFromLastRow = taxonParam => {
		fetch(`https://biotax-api.herokuapp.com/api/children/${taxonParam}`)
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

	fetchAllRowsByQuery = taxonParam => {
		fetch(`https://biotax-api.herokuapp.com/api/taxon/${taxonParam}`)
			.then(response => response.json())
			.then(
				data => {
					let childrenArrays = [];

					let activeItems = data.ancestors;
					activeItems.push(parseInt(taxonParam));
          console.log(activeItems);

					function getChildren(activeItems, childrenArrays, callback) {
						const url = `https://biotax-api.herokuapp.com/api/children/${activeItems[0]}`;
            // document.querySelectorAll(`.card__inner[data-id="${activeItems[0]}"]`);

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
				error => {
					this.setState({
						error
					});
				}
			);
	}

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

  repaintTree = (taxonId, rowId) => {
    const rowsCount = this.state.rows.length;

    if (rowId < rowsCount)
      // card on higher row has been clicked;
      // need to remove all rows lower this row and add one children row
      this.fetchChildrenFromNotLastRow(taxonId, rowId);
    else
      // just add one row to the end of tree
      this.fetchChildrenFromLastRow(taxonId);

    // TODO: implement link sharing
  }

  componentDidMount() {
    // return this.paintTree(this.props.taxonParam, this.props.rowParam);
    this.fetchKingdoms();
  }

  componentDidUpdate() {
    // window.scrollTo(0, document.body.scrollHeight);
    console.log("update");
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
            // updateUrl={this.updateUrl}
            repaintTree={this.repaintTree}
            toggleModal={this.props.toggleModal}
            styleCards={this.styleCards}
          />
        ))}
      </div>
    );
  }
}

export default Tree;
