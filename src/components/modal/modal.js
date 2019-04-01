import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./modal.sass";
import Close from "../close/close.js";
import Sharing from "../sharing/sharing.js";
import WikiIcon from "../../resources/images/wiki-icon.svg";

class Modal extends Component {
	constructor(props) {
    super(props);
    this.state = {
			error: null,
			isLoaded: false,
			data: [],
			showSharingPopup: false,
		};
  }

	// browseBack(e) {
	// 	e.stopPropagation();
	// 	this.props.history.goBack();
	// }

	toggleSharingPopup() {
		this.setState({showSharingPopup: !this.state.showSharingPopup});
	}

	componentDidMount() {
		const idParam = this.props.id || this.props.match.params.id;

		fetch(`https://biotax-api.herokuapp.com/api/taxon/${idParam}`)
			.then(data => data.json())
			.then(
				(data) => {
					console.log(data);
					this.setState({
						isLoaded: true,
						data: data
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
		const taxonId = this.props.id || this.props.match.params.id;
		const sharingLink = "";

		if (!taxonId) return null;

		if (error || !data) {
			return (
				<div className="modal">
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div style={ { margin: 10 } }>Error: {error ? error.message : "Taxon data was not found"}</div>

						<Close className="modal__close" onClick={this.props.toggleModal} />
					</div>
				</div>
			);
		} else if (!isLoaded) {
			return (
				<div className="modal">
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div style={ { margin: 10 } }>Loading...</div>
					</div>
				</div>
			);
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
								<img src={WikiIcon} alt="read on wikipedia" />
								Read more
							</a>

							<div
								id="sharing-btn"
								className="modal__control-btn"
								onClick={(e) => this.toggleSharingPopup(e)}
							>
								Share
							</div>

							{/* <Link
								to={`/?taxon=${data.parent}&row=${data.ancestors.length}`}
								className="modal__control-btn"
							>
								Close modal and show hierarchy
							</Link> */}

							<div className="modal__control-btn" id="add-bookmark">
								Bookmark
							</div>

							{this.state.showSharingPopup ?
								<Sharing url={`taxon/${data.id}`} className="modal__sharing" handleClose={(e) => this.toggleSharingPopup(e)} />
								: null
							}
						</div>

						<Close className="modal__close" onClick={this.props.toggleModal} />
					</div>
				</div>
			);
		}
	}
}

export default Modal;
