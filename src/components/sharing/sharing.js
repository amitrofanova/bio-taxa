import React, { Component } from "react";
import Close from "../close/close.js";
import "./sharing.sass";

function selectText(nodeId) {
  let node = document.getElementById(nodeId);

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
      console.warn("Unable to select text.");
  }
}

class Sharing extends Component {
	componentDidMount() {
		selectText("sharing-link");
	}

	render() {
		return(
			<div className={`sharing ${this.props.className}`} onClick={(e) => e.stopPropagation()} >
				<div className="sharing__title">Copy link below:</div>
				<div className="sharing__url" id="sharing-link">{window.location.href}</div>
				<Close className="sharing__close" onClick={this.props.handleClose}/>
			</div>
		)
	}
}

export default Sharing;
