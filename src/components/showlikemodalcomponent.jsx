import * as React from "react";
import TimeAgo from "javascript-time-ago";

// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
import Like from "./likecomponent";

const ShowLikeModal = props => {
  TimeAgo.addLocale(en);
  let timeAgo = new TimeAgo("en-US");

  return (
    <div
      className="modal fade"
      id="showLikeModal"
      role="dialog"
      aria-labelledby="showLikeModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">Likes</h5>
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
            {props.likes.length === 0
              ? "No likes for this tweet"
              : props.likes.map((like, ind) => (
                  <Like
                    key={ind}
                    ownerAddress={like.owner.substring(0, 16)}
                    timeAgo={timeAgo.format(like.time, "twitter")}
                  />
                ))}
          </div>
          <div className="modal-footer border-top-0 bg-light"></div>
        </div>
      </div>
    </div>
  );
};

export default ShowLikeModal;
