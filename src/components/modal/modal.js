import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./modal.sass";
// import Close from "../close/close.js";
import "../close/close.sass";
import WikiIcon from "../../resources/images/wiki-icon.svg";

function selectText(node) {
	console.log(node);
    node = document.getElementById(node);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

class Modal extends Component {
	constructor(props) {
    super(props);
    this.state = {
			error: null,
			isLoaded: false,
			data: [],
		};
  }

	shareLink() {
		let sharingPopup = document.createElement("div");

		sharingPopup.className = "modal__share-dialog share";
		sharingPopup.innerHTML = `
			<div class="share__title">Copy link below:</div>
			<div class="share__url" id="sharing-link">${window.location.href}</div>
		`;

		document.getElementById("sharing-btn").appendChild(sharingPopup);
		selectText("sharing-link")
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

							<div id="sharing-btn" onClick={this.shareLink} className="modal__control-btn">
								Share
							</div>

							<div className="modal__control-btn" id="show-hierarchy">
								Close modal and show hierarchy
							</div>

							<div className="modal__control-btn" id="add-bookmark">
								Bookmark
							</div>
						</div>

						<div className="close modal__close" onClick={(e) => this.browseBack(e)}></div>
					</div>
				</div>
			);
		}
	}
}

export default Modal;
