import React, { Component } from 'react';
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

    const kids = this.state.story.kids || [];

    if (this.state.story.text && kids[0] !== this.state.story.id) {
      kids.unshift(this.state.story.id);
    }

    const comments = kids.map((kid, index) => (
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