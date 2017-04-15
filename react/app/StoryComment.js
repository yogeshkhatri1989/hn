import React, { Component } from 'react';
import ReactFire from 'reactfire';
import Comment from './Comment';

class StoryComment extends Component {

  constructor(props) {
    
    super(props);
    this.state = {
      story: this.props.story
    }

  }

  closeStoryComment() {
    this.props.history.goBack();
  }

  render() {

    let kids = this.state.story.kids || [];
    let storyType = this.props.match.params.storyType;

    storyType == "ask" && kids.unshift(this.state.story.id);

    let comments = (kids).map((kid, index) => (
      <Comment key={`comment-${index}`} {...this.props} commentId={kid}></Comment>
    ));

    return (
      <div className="story-comment"> 
        <div className="story-comments-cont">
          <div className="story-detail">
            <span className="title">{this.state.story.title}</span>
            <span className="close-btn" onClick={this.closeStoryComment.bind(this)}>X</span>
          </div>

          <div className="comments-cont">
            {comments}
          </div>

        </div>
      </div>
    );
  }
}

export default StoryComment;