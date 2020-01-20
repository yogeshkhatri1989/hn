import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';

import ReactFire from 'reactfire';
import DOMPurify from 'dompurify';
import UserProfile from './UserProfile';

class Comment extends Component {

  constructor(props) {
  
    super(props);
    this.chainShown = !this.props.isReply;

    this.state = {
      replies: []
    };

  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
    const ref = this.props.firebaseRootRef.child(`/v0/item/${this.props.commentId}`);
    ReactFire.bindAsObject.call(this, ref, "comment");
  }

  fetchReplies(replies = []) {
    replies.forEach(reply => {
      if (this.state[`commentReplies${reply}`]) return;
      const ref = this.props.firebaseRootRef.child(`/v0/item/${reply}`);
      ReactFire.bindAsObject.call(this, ref, `commentReplies${reply}`);
    })
  }

  getReplies() {

    this.setState({
      replies: this.state.replies.length ? [] : (this.state.comment ? (this.state.comment.kids || []) : [])
    })
  }

  render() {

    const comment = this.state.comment;
    let commentRepliesBtnText = "";
    
    if (comment) {
      comment.timeByAgo = getTimeByAgo(comment.time);
      commentRepliesBtnText = comment.kids && comment.kids.length ? 
        (comment.kids.length == 1 ? "1 Reply" : `${comment.kids.length} Replies`) : 
        "";

      comment.text = DOMPurify.sanitize(comment.text);
      comment.text = comment.text.replace(/<a/g, "<a target='_blank' class='comment-link' ");
      
      if (this.props.isReply && !this.chainShown) {
        setTimeout(() => {
          this.getReplies();
        }, 0);
      }
      this.chainShown = true;
    }

    const replies = (this.state.replies.length ? this.state.replies : []).map(replyId => (
      <Comment key={`comment-${replyId}`} {...this.props} isReply={true} commentId={replyId} />
    ));
    const storyType = this.props.match.params.storyType;
    const story = this.props.story;

    return (
      <div className="hn-comment">
        {comment ?

          <div className={comment.type}>
            <div className="comment-text"
              dangerouslySetInnerHTML={{__html: comment.text}}>
            </div>
            
            {comment.type == "comment" && 
              <div className="bottom-bar">
                <span className="comment-prop comment-by">
                  <Link to={`/story/${storyType}/${story.id}/user/${this.props.commentId}/${comment.by}`} className="user-profile-link">
                    By {comment.by}
                  </Link>
                </span>
                <span className="comment-prop comment-time">{comment.timeByAgo}</span>
                
                <span className="comment-prop comment-replies-btn" onMouseEnter={this.fetchReplies.bind(this, this.state.comment.kids)} onClick={this.getReplies.bind(this)}>
                  {commentRepliesBtnText}
                </span>
              </div>
            }

            {
              this.state.replies.length ? 
                <div className="comment-cont">
                  {
                    this.state.replies.length ? <div className="comment-left-border" onClick={(e) => {
                      // this.getReplies();
                      e.target.parentNode.parentNode.scrollIntoView();
                    }}></div> : ''
                  }
                  <div className="comment-replies">
                    {replies}
                  </div>
                </div> : ""
            }

          </div> :
          "Loading..."
        }

        <Route path={`/story/${storyType}/${story.id}/user/${this.props.commentId}/:userId`} render={(props) => (
          <UserProfile firebaseRootRef={this.props.firebaseRootRef} {...props} />
        )} />
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


export default Comment;
