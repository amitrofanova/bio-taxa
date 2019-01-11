import React, { Component } from "react";
import {hot} from "react-hot-loader";
import "./App.sass";
import ModalGallery from "./components/hierarchy/hierarchy.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <ModalGallery />
      </div>
    )
  }
}

export default hot(module)(App);
