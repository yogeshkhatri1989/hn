import React, { Component } from 'react';
import ReactFire from 'reactfire';
import Comment from './Comment';
import Model from './Model';

class StoryComment extends Component {

  constructor(props) {
    
    super(props);
    this.state = {
      story: this.props.story
    }

  }

  render() {

    let kids = this.state.story.kids || [];
    let storyType = this.props.match.params.storyType;

    storyType == "ask" && kids.unshift(this.state.story.id);

    let comments = (kids).map((kid, index) => (
      <Comment key={`comment-${index}`} {...this.props} commentId={kid}></Comment>
    ));

    return (
      <Model title={this.state.story.title} {...this.props}>

        {comments}
        
      </Model>
    );
  }
}

export default StoryComment;