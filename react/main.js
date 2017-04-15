import React from "react";
import ReactDom from "react-dom";
import Firebase from 'firebase';
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

    let config = {
      databaseURL: 'https://hacker-news.firebaseio.com/'
    };

    Firebase.initializeApp(config);

    let firebaseRootRef = Firebase.database().ref();

    this.state = {
      firebaseRootRef: firebaseRootRef
    };

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
                <NavLink key={type} to={'/story/' + type} className="nav-link" activeClassName="selected">
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

