import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "../home/home.js";
import Modal from "../modal/modal.js";

class ModalSwitch extends React.Component {
	constructor(props) {
    super(props);
    this.state = {data: []};
  }
	previousLocation = this.props.location;

  componentWillUpdate(nextProps) {
    let { location } = this.props;

		console.log("location...", location);

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    let { location } = this.props;

    let isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // not initial render

    return (
      <div>
        <Switch location={isModal ? this.previousLocation : location}>
          <Route exact path="/" component={Home} />
					// FIXME: /taxon/:id doesn't render Modal
					<Route path="/taxon/:id" component={Modal} />
        </Switch>
        {isModal ?
					<Route
						path="/taxon/:id"
						component={Modal}
					/> : null}
      </div>
    );
  }
}

function ModalGallery() {
  return (
    <Router>
      <Route component={ModalSwitch} />
    </Router>
  );
}

export default ModalGallery;
