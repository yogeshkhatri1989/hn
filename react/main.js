import React from "react";
import ReactDom from "react-dom";
import * as Firebase from 'firebase/app';
import "firebase/database";
import ReactFire from 'reactfire';

import App from "./app/App";

import { 
  HashRouter as Router,
  Route,
  NavLink,
  Redirect
} from 'react-router-dom';

class Main extends React.Component {

  constructor(props) {

    super(props);

    const config = {
      databaseURL: 'https://hacker-news.firebaseio.com/'
    };

    Firebase.initializeApp(config);

    const firebaseRootRef = Firebase.database().ref();

    this.state = {
      firebaseRootRef: firebaseRootRef
    };

  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
  }

  fetchStoriyIds(storyCont) {
    if (this.state[`storyIds${storyCont}`]) {
      ReactFire.unbind.call(this, `storyIds${storyCont}`);
    }
    const firebaseRootRef = this.state.firebaseRootRef;
    const ref = firebaseRootRef.child(`/v0/${storyCont || 'top'}stories`);
    ReactFire.bindAsObject.call(this, ref, `storyIds${storyCont}`);
  }

  fetchStories() {
    console.log(this.state.storyIds);
    if (this.state.storyIds) {
      this.state.storyIds.forEach(storyId => {
        if (this.state[`story${storyId}`]) return;
        const ref = this.state.firebaseRootRef.child(`/v0/item/${storyId}`);
        ReactFire.bindAsObject.call(this, ref, `story${storyId}`);
        this.state[`story${storyId}`] = {};
      });
    }
  }

  render() {

    let firebaseRootRef = this.state.firebaseRootRef;

    return (
      <Router>
        <div>

          <div className="header">

            <div className="title">
              Hacker News
            </div>
            
            <div className="nav-links-cont">

              {['top', 'new', 'ask', 'show', 'job'].map(type => (
                <NavLink
                  key={type}
                  to={'/story/' + type}
                  className="nav-link"
                  activeClassName="selected"
                  onMouseEnter={this.fetchStoriyIds.bind(this, type)}
                  onMouseDown={this.fetchStories.bind(this)}>
                  
                  {type}
                </NavLink>
              ))}

            </div>

          </div>

          <Route exact path="/" render={() => (
            <Redirect to="/story/top" />
          )} />

          <Route path="/story/:storyCont" render={(props) => (
            <App firebaseRootRef={firebaseRootRef} {...props} />
          )}/>
          

        </div>
      </Router>
    )

  }

}

ReactDom.render(<Main />, document.getElementById('app'));

import "./styles/style.less";

