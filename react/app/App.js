import React, { Component } from 'react';
import ReactFire from 'reactfire';
import Story from './Story';

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      storyIds: []
    };
  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
    const firebaseRootRef = this.props.firebaseRootRef;
    const storyCont = this.props.match.params.storyCont;
    const ref = firebaseRootRef.child(`/v0/${storyCont || 'top'}stories`);
    ReactFire.bindAsObject.call(this, ref, "storyIds");
  }

  componentWillUpdate(nextProps, nextState) {

    const storyCont = nextProps.match.params.storyCont;
    if (this.props.match.params.storyCont == storyCont) return;

    ReactFire.unbind.call(this, "storyIds");
    const firebaseRootRef = this.props.firebaseRootRef;
    const ref = firebaseRootRef.child(`/v0/${storyCont || 'top'}stories`);
    ReactFire.bindAsObject.call(this, ref, "storyIds");
  }

  componentWillUnmount() {
    ReactFire.unbind.call(this, "storyIds");
  }

  render() {

    const stories = (this.state.storyIds || [])
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