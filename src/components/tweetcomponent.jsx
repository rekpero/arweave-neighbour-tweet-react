import * as React from "react";
import CommentModal from "./commentmodalcomponent";

const Tweet = props => {
  let likeImage = props.isLiked
    ? "likeRed.9d26d8c7.svg"
    : "likeGrey.fbbc53b2.svg";
  let likeTweet = () => {
    props.likeTweet(props.tweets);
  };
  const openTweet = () => {
    if (props.walletAddress === props.ownerAddress) {
      props.setTab(1);
    } else {
      props.setId(props.ownerAddress);
      props.setTab(2);
    }
  };
  return (
    <div>
      <div className="row">
        <CommentModal
          wallet={props.wallet}
          walletAddress={props.walletAddress}
          tweet={props.tweets}
          tweetCommented={props.tweetCommented}
        />
        <div className="col-md-1">
          <img
            src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/postAvatar.706965c3.svg"
            alt="post avatar"
            className="rounded-circle border border-primary mt-1"
          />
        </div>
        <div className="col-md-11">
          <div className="d-flex align-items-center">
            <div className="mr-1 pl-2">
              <a onClick={openTweet} style={{ textDecoration: "none" }}>
                <strong>{props.ownerAddress.substring(0, 16)}</strong>
              </a>
            </div>
            <div className="mr-1">
              <img
                src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/circle.3a760e5c.svg"
                alt="circle"
                style={{ width: 4, height: 4 }}
              />
            </div>
            <div className="text-secondary">{props.timeAgo}</div>
          </div>
          <div className="pl-2 mb-1">{props.tweet}</div>
          {props.imageUrl !== null ? (
            <div
              className="ml-2 mb-2 rounded-lg border"
              style={{
                backgroundImage: "url('" + props.imageUrl + "')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: 200
              }}
              onClick={e => {
                props.setModalImage(props.imageUrl);
              }}
            ></div>
          ) : null}

          <div className="d-flex justify-content-around">
            <div
              className="text-secondary d-flex align-items-center"
              style={{ fontSize: 18 }}
            >
              <img
                src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/comment.b611f7dd.svg"
                alt="comment"
                style={{ height: 20, width: 20 }}
                className="mr-2"
                data-toggle="modal"
                data-target="#commentModal"
              />{" "}
              <span onClick={e => props.showComments(props.tweets)}>
                {props.commentNumber}
              </span>
            </div>

            <div
              className="text-secondary d-flex align-items-center"
              style={{ fontSize: 18 }}
            >
              <img
                src={
                  "https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/" +
                  likeImage
                }
                alt="like"
                style={{ height: 20, width: 20 }}
                className="mr-2"
                onClick={likeTweet}
              />{" "}
              <span onClick={e => props.showLikes(props.tweets)}>
                {props.likeNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2" />
    </div>
  );
};
export default Tweet;
