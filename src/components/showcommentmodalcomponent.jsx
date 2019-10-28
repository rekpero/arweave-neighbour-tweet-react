import * as React from "react";
import Comment from "./commentcomponent";
import TimeAgo from "javascript-time-ago";

// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";

const ShowCommentModal = props => {
  TimeAgo.addLocale(en);
  let timeAgo = new TimeAgo("en-US");

  return (
    <div
      className="modal fade"
      id="showCommentModal"
      role="dialog"
      aria-labelledby="showCommentModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Comments</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body bg-light">
            {props.comments.length === 0
              ? "No comments for this tweet"
              : props.comments.map((com, ind) => (
                  <Comment
                    key={ind}
                    ownerAddress={com.owner.substring(0, 16)}
                    timeAgo={timeAgo.format(com.time, "twitter")}
                    comment={com.comment}
                    imageUrl={com.imageFile}
                  />
                ))}
          </div>
          <div className="modal-footer border-top-0 bg-light"></div>
        </div>
      </div>
    </div>
  );
};

export default ShowCommentModal;
