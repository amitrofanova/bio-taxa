import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./modal.sass";
// import Close from "../close/close.js";

class Modal extends Component {
	constructor(props) {
    super(props);
    this.state = {
			error: null,
			isLoaded: false,
			data: [],
		};
  }

	browseBack(e) {
		e.stopPropagation();
		this.props.history.goBack();
	};

	componentDidMount() {
		const idParam = this.props.match.params.id;
		fetch(`https://biotax-api.herokuapp.com/api/taxon/${idParam}`)
			.then(res => res.json())
			.then(
				(result) => {
					console.log("fetch taxon... ", result);
					this.setState({
						isLoaded: true,
						data: result
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
		const { error, isLoaded, data } = this.state;
		const taxonId = this.props.match.params.id;

		if (!taxonId) return null;

		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div className="modal" data-id={data.id}>
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div className="modal__title"> {data.title} </div>

						<div className="modal__content">
							<div className="modal__hierarchy"></div>

							<div className="modal__info">
							<img src={`${data.image_url}`} alt={`${data.name}`} className="modal__img" />

								<div className="modal__description">
									{data.description}
								</div>
							</div>
						</div>

						<div className="modal__controls">
							<a href={`${data.url}`} target="_blank" className="modal__control-btn">
								<img src="assets/images/wiki-icon.svg" alt="read on wikipedia" />
								Read more
							</a>

							<a href="" target="_blank" className="modal__control-btn">
								Share
							</a>

							<div className="modal__control-btn" id="show-hierarchy">
								Close modal and show hierarchy
							</div>

							<div className="modal__control-btn" id="add-bookmark">
								Bookmark
							</div>
						</div>

						// TODO: add separate component
						<div className="close modal__close" onClick={(e) => this.browseBack(e)}></div>
					</div>
				</div>
			);
		}
	}
}

export default Modal;
