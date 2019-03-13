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

	browseBack(e) {
		e.stopPropagation();
		this.props.history.goBack();
	}

	toggleSharingPopup() {
		this.setState({showSharingPopup: !this.state.showSharingPopup});
	}

	shareLink() {
		// let sharingPopup = document.createElement("div");
		//
		// sharingPopup.className = "modal__share-dialog share";
		// sharingPopup.innerHTML = `
		// 	<div class="share__title">Copy link below:</div>
		// 	<div class="share__url" id="sharing-link">${window.location.href}</div>
		// `;
		//
		// document.getElementById("sharing-btn").appendChild(sharingPopup);

		{this.toggleSharingPopup}
		selectText("sharing-link");
	}

	componentDidMount() {
		const idParam = this.props.match.params.id;

		fetch(`https://biotax-api.herokuapp.com/api/taxon/${idParam}`)
			.then(res => res.json())
			.then(
				(result) => {
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
		const sharingLink = this.props.match.url;

		if (!taxonId) return null;

		if (error) {
			return (
				<div className="modal">
					<div className="modal__bg"></div>

					<div className="modal__inner">
						<div style={ { margin: 10 } }>Error: {error.message}</div>;
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
								{this.state.showSharingPopup ?
									<Sharing className="modal__sharing" handleClose={(e) => this.toggleSharingPopup(e)}/>
									: null
								}
							</div>

							<div className="modal__control-btn" id="show-hierarchy">
								Close modal and show hierarchy
							</div>

							<div className="modal__control-btn" id="add-bookmark">
								Bookmark
							</div>
						</div>

						<Close className="modal__close" onClick={(e) => this.browseBack(e)} />
					</div>
				</div>
			);
		}
	}
}

export default Modal;
