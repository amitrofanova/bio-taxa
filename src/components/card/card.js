import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./card.sass";

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleHierarchyClick = evt => {
		const target = evt.target;

    const taxonId = target.dataset.id;
    const rowId = parseInt(target.dataset.row) + 1;
		const $selectedCard = target.closest(".card");

		this.props.repaintTree(taxonId, rowId);
		this.props.styleCards($selectedCard);
	}

	render() {
		return (
			<div className="card">
				{/* <Link to={`/taxon/${this.props.id}`} className="card__inner"> */}
				<div className={this.props.image ? "card__title" : "card__title_no-img"}>
					{this.props.title || this.props.name}
				</div>

				{this.props.image &&
					<div className="card__img">
						<img src={`${this.props.image}`} alt={`${this.props.name}`} />
					</div>
				}

				<div data-id={this.props.id} onClick={this.props.toggleModal} className="card__description">
					{this.props.description || "Taxon has no description"}
				</div>


				<div className="card__controllers">
					<a href={`${this.props.url}`} target="_blank" className="card__wiki-btn"></a>

					{/*
						show Hieararchy btn if taxon has descendants
					 	"!this.props.row" is for the kingdoms (0th row) that don't have children_count property
					*/}
					{(!this.props.row || this.props.childrenCount) ? (
						<div
							data-id={this.props.id}
							data-row={this.props.row}
							className="card__hierarchy-btn"
							onClick={this.handleHierarchyClick}
						>
						</div>
					) : (
						<div className="card__leaf">Leaf</div>
					)}
				</div>
			</div>
		);
	}
}

export default Card;
