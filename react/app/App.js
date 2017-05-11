import React, { Component } from 'react';
import ReactDom from 'react-dom';
import Firebase from 'firebase';
import ReactFire from 'reactfire';
import { Link } from 'react-router-dom';
import Story from './Story';

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {storyIds: []};
  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
    let firebaseRootRef = this.props.firebaseRootRef;
    let storyCont = this.props.match.params.storyCont;
    let ref = firebaseRootRef.child(`/v0/${storyCont || 'top'}stories`);
    ReactFire.bindAsObject.call(this, ref, "storyIds");
  }

  componentWillUpdate(nextProps, nextState) {

    let storyCont = nextProps.match.params.storyCont;
    if (this.props.match.params.storyCont == storyCont) return;

    ReactFire.unbind.call(this, "storyIds");
    let firebaseRootRef = this.props.firebaseRootRef;
    let ref = firebaseRootRef.child(`/v0/${storyCont || 'top'}stories`);
    ReactFire.bindAsObject.call(this, ref, "storyIds");
  }

  componentWillUnmount() {
    ReactFire.unbind.call(this, "storyIds");
  }

  render() {

    let stories = (this.state.storyIds || [])
      .slice(0, 30)
      .map((storyId, index) => {
        return (
          <Story key={storyId} 
            storyIndex={index} 
            firebaseRootRef={this.props.firebaseRootRef} 
            storyId={storyId}
            storyCont={this.props.match.params.storyCont} >
          </Story>
        )
      });

    return (
      <div>
        <div className="stories-cont">
          {stories.length ? stories : "Loading..."}
        </div>
      </div>
    );
  }
}

export default App;