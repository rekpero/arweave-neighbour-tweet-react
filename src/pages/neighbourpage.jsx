import React from "react";
import postAvatar from "../assets/images/postAvatar.svg";
import autosize from "autosize";
import ApiService from "../services/api";
import Toast from "../components/toastcomponent";
import $ from "jquery";
import Tweet from "../components/tweetcomponent";
import TimeAgo from "javascript-time-ago";

// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
import ShowCommentModal from "../components/showcommentmodalcomponent";
import ShowLikeModal from "../components/showlikemodalcomponent";
import SendGiftCardModal from "../components/sendgiftcardmodalcomponent";

export default class NeighbourPage extends React.Component {
  showComment = null;
  showLike = null;
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      allTweets: [],
      loadingTweet: true,
      toastTitle: "",
      toastMessage: "",
      showComments: [],
      showLikes: []
    };
  }

  componentDidMount() {
    autosize(this.textarea);
    console.log(this.props.match.params.id);

    this.logTweet = setInterval(async () => {
      const allTweets = await ApiService.getAllTweetsByWallet(
        this.props.match.params.id
      );
      if (JSON.stringify(allTweets) !== JSON.stringify(this.state.allTweets)) {
        this.setState(
          {
            allTweets,
            loadingTweet: false
          },
          () => {
            console.log(this.state.allTweets);
          }
        );
      }
    }, 10000);

    TimeAgo.addLocale(en);
    this.timeAgo = new TimeAgo("en-US");

    this.watchLocation = navigator.geolocation.getCurrentPosition(position => {
      this.setState(
        {
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        },
        () => {
          console.log(this.state.currentLocation);
        }
      );
    });
  }
  componentDidUpdate() {
    autosize(this.textarea);
  }

  showComments = tweet => {
    this.setState({ showComments: tweet.comments }, () => {
      this.showComment.click();
    });
  };

  showLikes = tweet => {
    this.setState({ showLikes: tweet.likes }, () => {
      this.showLike.click();
    });
  };

  likeTweet = async tweet => {
    console.log(tweet);
    const response = await ApiService.likeTweet(
      tweet.txid,
      this.props.walletAddress,
      this.props.wallet
    );
    console.log(response);
    this.setState(
      { toastTitle: "Like", toastMessage: "Yea! Post liked" },
      () => {
        $(".toast").toast("show");
      }
    );
  };

  tweetCommented = () => {
    this.setState(
      { toastTitle: "Comment", toastMessage: "Yea! Post commented" },
      () => {
        $(".toast").toast("show");
      }
    );
  };

  componentWillUnmount() {
    clearInterval(this.logTweet);
    navigator.geolocation.clearWatch(this.watchLocation);
  }
  render() {
    return (
      <div className="container">
        <Toast
          title={this.state.toastTitle}
          message={this.state.toastMessage}
        ></Toast>
        <ShowCommentModal comments={this.state.showComments} />
        <button
          type="button"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#showCommentModal"
          ref={btn => (this.showComment = btn)}
        ></button>
        <ShowLikeModal likes={this.state.showLikes} />
        <button
          type="button"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#showLikeModal"
          ref={btn => (this.showLike = btn)}
        ></button>
        <SendGiftCardModal
          sendAddress={this.props.match.params.id}
          wallet={this.props.wallet}
        />
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div>
              <div className="my-3">
                <div>
                  <img
                    src={postAvatar}
                    alt="post avatar"
                    className="rounded-circle border border-primary mt-1"
                    style={{ height: 100, width: 100 }}
                  />
                </div>
                <div className="my-2">
                  <strong>{this.props.match.params.id}</strong>
                </div>
                <div className="my-2">
                  <button
                    className="btn btn-primary"
                    disabled={
                      this.props.match.params.id === this.props.walletAddress
                    }
                    data-toggle="modal"
                    data-target="#sendGiftCardModal"
                  >
                    <strong>Send Gift Card</strong>
                  </button>
                </div>
                <div className="d-flex">
                  <div className="mr-3">
                    <strong>{this.state.allTweets.length}</strong>{" "}
                    <span className="text-secondary">Tweets</span>
                  </div>
                  <div className="mr-3">
                    <strong>
                      {this.state.allTweets.length === 0
                        ? 0
                        : this.state.allTweets
                            .map(tweet => tweet.comments.length)
                            .reduce((prev, curr) => prev + curr)}
                    </strong>{" "}
                    <span className="text-secondary">Comments</span>
                  </div>
                  <div className="mr-3">
                    <strong>
                      {this.state.allTweets.length === 0
                        ? 0
                        : this.state.allTweets
                            .map(tweet => tweet.likes.length)
                            .reduce((prev, curr) => prev + curr)}
                    </strong>{" "}
                    <span className="text-secondary">Likes</span>
                  </div>
                </div>
              </div>
              <hr className="mt-2 mb-1" />
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  Recent Tweets
                </div>
                {this.state.loadingTweet ? (
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ height: 28, width: 28 }}
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : null}
              </div>
              <hr className="my-2" />
              {this.state.allTweets.map((tweets, index) => (
                <Tweet
                  key={index}
                  ownerAddress={tweets.owner.substring(0, 16)}
                  timeAgo={this.timeAgo.format(tweets.time, "twitter")}
                  tweet={tweets.tweet}
                  imageUrl={tweets.imageFile}
                  commentNumber={tweets.comments.length}
                  likeNumber={tweets.likes.length}
                  isLiked={
                    tweets.likes.length === 0
                      ? false
                      : tweets.likes.filter(
                          like => like.owner === this.props.walletAddress
                        ).length === 1
                  }
                  tweets={tweets}
                  likeTweet={this.likeTweet}
                  wallet={this.props.wallet}
                  walletAddress={this.props.walletAddress}
                  tweetCommented={this.tweetCommented}
                  showComments={this.showComments}
                  showLikes={this.showLikes}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
