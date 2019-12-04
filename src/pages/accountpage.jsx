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
import GiftCard from "../components/giftcardcomponent";
import ShowImageModal from "../components/showimagemodalcomponent";

export default class AccountPage extends React.Component {
  showComment = null;
  showLike = null;
  showImage = null;
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      allTweets: [],
      allSentGiftCard: [],
      allGotGiftCard: [],
      loadingTweet: true,
      loadingSentGift: true,
      loadingGotGift: true,
      toastTitle: "",
      toastMessage: "",
      showDiv: "tweet",
      showComments: [],
      showLikes: [],
      showImageModal: ""
    };
  }

  componentDidMount() {
    autosize(this.textarea);

    this.logTweet = setInterval(async () => {
      const allTweets = await ApiService.getAllTweetsByWallet(
        this.props.walletAddress
      );
      if (
        JSON.stringify(allTweets) !== JSON.stringify(this.state.allTweets) ||
        allTweets.length === 0
      ) {
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
    }, 6000);

    this.logSentGiftCard = setInterval(async () => {
      const allSentGiftCard = await ApiService.getSentGiftCard(
        this.props.walletAddress
      );
      if (
        JSON.stringify(allSentGiftCard) !==
          JSON.stringify(this.state.allSentGiftCard) ||
        allSentGiftCard.length === 0
      ) {
        this.setState(
          {
            allSentGiftCard,
            loadingSentGift: false
          },
          () => {
            console.log(this.state.allSentGiftCard);
          }
        );
      }
    }, 6000);

    this.logGotGiftCard = setInterval(async () => {
      const allGotGiftCard = await ApiService.getGotGiftCard(
        this.props.walletAddress
      );
      if (
        JSON.stringify(allGotGiftCard) !==
          JSON.stringify(this.state.allGotGiftCard) ||
        allGotGiftCard.length === 0
      ) {
        this.setState(
          {
            allGotGiftCard,
            loadingGotGift: false
          },
          () => {
            console.log(this.state.allGotGiftCard);
          }
        );
      }
    }, 6000);

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

  setModalImage = imageUrl => {
    this.setState({ showImageModal: imageUrl }, () => {
      this.showImage.click();
    });
  };

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

  showTweetDiv = () => {
    this.setState({ showDiv: "tweet" });
  };

  showSentGiftCardDiv = () => {
    this.setState({ showDiv: "sentGiftCard" });
  };

  showGotGiftCardDiv = () => {
    this.setState({ showDiv: "gotGiftCard" });
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
    clearInterval(this.logGotGiftCard);
    clearInterval(this.logSentGiftCard);
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
          className="btn btn-primary align-self-center"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#showCommentModal"
          ref={btn => (this.showComment = btn)}
        ></button>
        <ShowLikeModal likes={this.state.showLikes} />
        <button
          type="button"
          className="btn btn-primary align-self-center"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#showLikeModal"
          ref={btn => (this.showLike = btn)}
        ></button>
        <ShowImageModal imageUrl={this.state.showImageModal} />
        <button
          type="button"
          className="btn btn-primary align-self-center"
          style={{ display: "none" }}
          data-toggle="modal"
          data-target="#showImageModal"
          ref={btn => (this.showImage = btn)}
        ></button>
        <div className="row">
          <div className="col-md-3">
            <ul className="list-group my-3">
              <li
                className={
                  "list-group-item " +
                  (this.state.showDiv === "tweet" ? "active" : null)
                }
                onClick={this.showTweetDiv}
              >
                <strong>Your tweets</strong>
              </li>
              <li
                className={
                  "list-group-item " +
                  (this.state.showDiv === "sentGiftCard" ? "active" : null)
                }
                onClick={this.showSentGiftCardDiv}
              >
                <strong>Your sent gift card</strong>
              </li>
              <li
                className={
                  "list-group-item " +
                  (this.state.showDiv === "gotGiftCard" ? "active" : null)
                }
                onClick={this.showGotGiftCardDiv}
              >
                <strong>Your gift card</strong>
              </li>
            </ul>
          </div>
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
                  <strong>{this.props.walletAddress}</strong>
                </div>

                <div className="d-flex my-1">
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
                <div className="d-flex my-1">
                  <div className="mr-3">
                    <strong>{this.state.allSentGiftCard.length}</strong>{" "}
                    <span className="text-secondary">Sent Gift Cards</span>
                  </div>
                  <div className="mr-3">
                    <strong>{this.state.allGotGiftCard.length}</strong>{" "}
                    <span className="text-secondary">Got Gift Cards</span>
                  </div>
                </div>
              </div>
              <hr className="mt-2 mb-1" />
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  {this.state.showDiv === "tweet"
                    ? "Recent Tweets"
                    : this.state.showDiv === "sentGiftCard"
                    ? "Sent Gift Cards"
                    : "Got Gift Cards"}
                </div>
                {this.state.showDiv === "tweet" ? (
                  this.state.loadingTweet ? (
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ height: 28, width: 28 }}
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : null
                ) : this.state.showDiv === "sentGiftCard" ? (
                  this.state.loadingSentGift ? (
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ height: 28, width: 28 }}
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : null
                ) : this.state.loadingGotGift ? (
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

              {this.state.showDiv === "tweet"
                ? this.state.allTweets.length === 0
                  ? "No Tweets Found."
                  : this.state.allTweets.map((tweets, index) => (
                      <Tweet
                        key={index}
                        ownerAddress={tweets.owner}
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
                        setModalImage={this.setModalImage}
                        setTab={this.props.setTab}
                        setId={this.props.setId}
                      />
                    ))
                : this.state.showDiv === "sentGiftCard"
                ? this.state.allSentGiftCard.length === 0
                  ? "You have not sent any gift cards."
                  : this.state.allSentGiftCard.map(giftCard => (
                      <GiftCard
                        key={giftCard.txid}
                        fromAddress={giftCard.owner}
                        toAddress={giftCard.target}
                        amount={parseFloat(
                          ApiService.convertToAr(giftCard.amount)
                        )}
                        note={giftCard.note}
                        timeAgo={this.timeAgo.format(giftCard.time, "twitter")}
                        walletAddress={this.props.walletAddress}
                      />
                    ))
                : this.state.allGotGiftCard.length === 0
                ? "You have not gotten any gift cards."
                : this.state.allGotGiftCard.map(giftCard => (
                    <GiftCard
                      key={giftCard.txid}
                      fromAddress={giftCard.owner}
                      toAddress={giftCard.target}
                      amount={parseFloat(
                        ApiService.convertToAr(giftCard.amount)
                      )}
                      note={giftCard.note}
                      timeAgo={this.timeAgo.format(giftCard.time, "twitter")}
                      walletAddress={this.props.walletAddress}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
