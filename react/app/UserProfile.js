import React, { Component } from 'react';
import ReactFire from 'reactfire';
import DOMPurify from 'dompurify';
import Model from './Model';

class UserProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
    let ref = this.props.firebaseRootRef.child(`/v0/user/${this.props.match.params.userId}`);
    ReactFire.bindAsObject.call(this, ref, "user");
  }

  render() {

    let user = this.state.user;

    return (

      <Model title={this.props.match.params.userId} {...this.props}>
      { user ? 
          <div>
            <span className="user-prop user-karma">{user.karma} Karma</span>
            <br />
            <br />
            <span className="user-prop user-created">Created {getTimeByAgo(user.created)}</span>
            <br />
            <br />
            <span className="user-prop user-about"
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(user.about)}}>
            </span>
          </div>
      : "Loading..." }
      </Model>
    );
  }
}


function getTimeByAgo(time){

  var timeByAgo = (Date.now()/1000) - time;

  var timeNames = [
    {name: "Second", value: timeByAgo },
    {name: "Minute", value: timeByAgo / (60) },
    {name: "Hour",   value: timeByAgo / (60 * 60)},
    {name: "Day",    value: timeByAgo / (24 * 60 * 60) },
    {name: "Month",  value: timeByAgo / (30 * 24 * 60 * 60) },
    {name: "Year",   value: timeByAgo / (365 * 24 * 60 * 60) }
  ];

  var i;
  for (i = 0; i < timeNames.length; i++){
    if (timeNames[i].value < 1) {
      i--;
      break;
    }
  }

  i = Math.min(i, timeNames.length - 1);

  timeByAgo = parseInt(timeNames[i].value);

  var name = timeByAgo == 1 ? timeNames[i].name : timeNames[i].name + "s";

  return timeByAgo + " " + name.toLowerCase() + " ago"

}
export default UserProfile;
