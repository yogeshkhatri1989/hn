import React, { Component } from 'react';

class Model extends Component {

  constructor(props) {
    super(props);
  }

  closeModel() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="model-cont">
        <div className="backdrop" onClick={this.closeModel.bind(this)}>
        </div>
        <div className="hn-model">

          <div className="hn-model-title">
            <span className="title">{this.props.title}</span>
            <span className="close-btn" onClick={this.closeModel.bind(this)}>X</span>
          </div>

          <div className="hn-model-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Model;