import React, { Component } from 'react';
import ReactFire from 'reactfire';
import {
  Route,
  Link
} from 'react-router-dom';

import StoryComment from './StoryComment';
import UserProfile from './UserProfile';

class Story extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
    let ref = this.props.firebaseRootRef.child(`/v0/item/${this.props.storyId}`);
    ReactFire.bindAsObject.call(this, ref, "story");
  }

  fetchComments(story) {
    (story.kids || []).forEach(kid => {
      if (this.state[`storyComments${kid}`]) return;
      const ref = this.props.firebaseRootRef.child(`/v0/item/${kid}`);
      ReactFire.bindAsObject.call(this, ref, `storyComments${kid}`);
    });
  }

  componentWillUpdate(nextProps, nextState) {

    if (!this.state.story) return;
    let currStory = this.state.story;
    let nextStory = nextState.story;
    let elems = [];

    if (nextStory.score != currStory.score) {
      elems.push([
        this.refs.storyScore, 
        nextStory.score > currStory.score ? "moveup" : "movedown"
      ]);
    }

    if (nextStory.descendants != currStory.descendants) {
      elems.push([
        this.refs.storyDescendants, 
        nextStory.descendants > currStory.descendants ? "moveup" : "movedown"
      ]);
    }

    elems.forEach(elem => elem[0].classList.add(elem[1]));

    setTimeout(function() {
      elems.forEach(elem => elem[0].classList.remove("moveup", "movedown"))
    }, 2500);
  }

  render() {

    let story = this.state.story;
    let storyCont = this.props.storyCont;
    if (story) {
      story.displayUrl = story.url ? new URL(story.url).host : "";
      story.timeByAgo = getTimeByAgo(story.time);
    }

    return (
      <div className="hn-story">
        {story ? 
          <div ref="storyCont" className="story-cont">

            <div className="center-content">
              {/* <span className="story-index">{this.props.storyIndex + 1}. </span> */}
              {
                story.url ?
                  <a className="story-link" href={story.url} target="_blank">{story.title}</a> :
                  <Link className="story-link" to={`/story/${storyCont}/${story.id}`}>{story.title}</Link>
              }
              <span className="url-cont"> ({story.displayUrl})</span>

              <div className="bottom-bar">
                <span ref="storyScore" className="story-prop story-score">{story.score} Points</span>
                <span className="story-prop story-by">
                  <Link to={`/story/${storyCont}/user/${story.id}/${story.by}`} className="user-profile-link">
                    By {story.by}
                  </Link>
                </span>
                <span className="story-prop story-time">{story.timeByAgo}</span>
              </div>
            </div>

            <Link to={`/story/${storyCont}/${story.id}`} className="right-side" onMouseEnter={this.fetchComments.bind(this, story)}>
              <span ref="storyDescendants">{story.descendants} Comments</span>
            </Link>

            <Route path={`/story/:storyType/${story.id}`} render={(props) => (
              <StoryComment firebaseRootRef={this.props.firebaseRootRef} {...props} story={story} />
            )} />

            <Route path={`/story/:storyType/user/${story.id}/:userId`} render={(props) => (
              <UserProfile firebaseRootRef={this.props.firebaseRootRef} {...props} />
            )} />

          </div> :
          "Loading..."}
      </div>
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

export default Story;