import React, { Component } from 'react';
import ReactFire from 'reactfire';
import DOMPurify from 'dompurify';

class Comment extends Component {

  constructor(props) {
  
    super(props);
    this.state = {
      replies: []
    };

  }

  componentWillMount() {
    ReactFire.componentWillMount.call(this);
    let ref = this.props.firebaseRootRef.child(`/v0/item/${this.props.commentId}`);
    ReactFire.bindAsObject.call(this, ref, "comment");
  }

  getReplies() {

    this.setState({
      replies: this.state.replies.length ? [] : this.state.comment.kids
    })
  }

  render() {

    let comment = this.state.comment;
    let commentRepliesBtnText = "";

    if (comment) {
      comment.timeByAgo = getTimeByAgo(comment.time);
      commentRepliesBtnText = comment.kids && comment.kids.length ? 
        (comment.kids.length == 1 ? "1 Reply" : `${comment.kids.length} Resplies`) : 
        "";
    }

    let replies = (this.state.replies || []).map(replyId => (
      <Comment key={`comment-${replyId}`} {...this.props} commentId={replyId} />
    ));
    let storyType = this.props.match.params.storyType;

    return (
      <div className="hn-comment">
        {this.state.comment ?

          <div className={comment.type}>
            <div className="comment-text"
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.text)}}>
            </div>
            
            {comment.type == "comment" && 
              <div className="bottom-bar">
                <span className="comment-prop comment-by">By {comment.by}</span>
                <span className="comment-prop comment-time">{comment.timeByAgo}</span>
                
                <span className="comment-prop comment-replies-btn" onClick={this.getReplies.bind(this)}>
                  {commentRepliesBtnText}
                </span>
              </div>
            }

            <div className="comment-replies">
              {replies}
            </div>

          </div> :
          "Loading..."
        }
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
