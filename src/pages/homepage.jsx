import React from "react";
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
import ShowImageModal from "../components/showimagemodalcomponent";

export default class HomePage extends React.Component {
  textarea = null;
  inputImage = null;
  showComment = null;
  showLike = null;
  showImage = null;
  constructor(props) {
    super(props);
    this.state = {
      tweet: "",
      imageFile: null,
      sendTweetLoad: false,
      currentLocation: null,
      loadingTweet: true,
      allTweets: [],
      filteredTweets: [],
      neighbourhoodDistance: 3000,
      toastTitle: "",
      toastMessage: "",
      showComments: [],
      showLikes: [],
      showImageModal: ""
    };
  }

  componentDidMount() {
    this.textarea.focus();
    autosize(this.textarea);

    this.logTweet = setInterval(async () => {
      const allTweets = await ApiService.getAllTweets();
      if (
        JSON.stringify(allTweets) !== JSON.stringify(this.state.allTweets) ||
        allTweets.length === 0
      ) {
        this.setState(
          {
            allTweets,
            filteredTweets:
              this.state.currentLocation === null
                ? allTweets
                : allTweets.filter(
                    tweet =>
                      this.distance(
                        tweet.currentLocation.latitude,
                        tweet.currentLocation.longitude,
                        this.state.currentLocation.latitude,
                        this.state.currentLocation.longitude
                      ) < this.state.neighbourhoodDistance
                  ),
            loadingTweet: false
          },
          () => {
            console.log(this.state.allTweets);
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

  handleImageUpload = () => {
    this.inputImage.click();
  };

  loadTweets = event => {
    this.setState({ tweet: event.target.value });
  };

  loadImage = event => {
    const reader = new FileReader();
    reader.readAsDataURL(event.currentTarget.files[0]);
    reader.onload = async () => {
      this.setState({
        imageFile: reader.result
      });
    };
  };

  loadNeighbourhoodDistance = event => {
    this.setState({
      neighbourhoodDistance: event.target.value,
      filteredTweets: this.state.allTweets.filter(
        tweet =>
          this.distance(
            tweet.currentLocation.latitude,
            tweet.currentLocation.longitude,
            this.state.currentLocation.latitude,
            this.state.currentLocation.longitude
          ) < event.target.value
      )
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

  removeImage = () => {
    this.setState({ imageFile: null });
  };

  postTweet = async () => {
    this.setState({ sendTweetLoad: true });
    console.log({ tweet: this.state.tweet, imageFile: this.state.imageFile });
    const response = await ApiService.postTweet(
      {
        tweet: this.state.tweet,
        imageFile: this.state.imageFile,
        currentLocation: this.state.currentLocation
      },
      this.props.wallet
    );
    console.log(response);
    this.setState(
      {
        sendTweetLoad: false,
        tweet: "",
        imageFile: null,
        imageUrl: "",
        toastTitle: "Tweet",
        toastMessage: "Yea! Tweet posted"
      },
      () => {
        $(".toast").toast("show");
      }
    );
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

  distance = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km (change this constant to get miles)
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  openTweet = id => {
    this.props.setId(id);
    this.props.setTab(2);
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
            <div className="my-3">
              <label>
                <strong>Neighbourhood (in Km)</strong>
              </label>
              <input
                type="range"
                className="custom-range"
                min="0"
                max="10000"
                step="1"
                value={this.state.neighbourhoodDistance}
                onChange={this.loadNeighbourhoodDistance}
              ></input>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>0 km</strong>
                </div>
                <div>
                  <strong>10,000 km</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="my-3 rounded p-3 border shadow bg-light">
              <div className="row">
                <div className="col-md-1 col-xs-1 col-sm-1">
                  <img
                    src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/postAvatar.706965c3.svg"
                    alt="post avatar"
                    className="rounded-circle border border-primary mt-1"
                  />
                </div>
                <div className="col-md-11 col-xs-11 col-sm-11">
                  <div className="mb-2">
                    <textarea
                      rows={2}
                      ref={c => (this.textarea = c)}
                      placeholder="What's happening?"
                      className="border-0 bg-light w-100"
                      style={{ fontSize: 24 }}
                      value={this.state.tweet}
                      onChange={this.loadTweets}
                    />
                  </div>
                  {this.state.imageFile !== null ? (
                    <div
                      className="p-2 mb-3 rounded-lg d-flex justify-content-end"
                      style={{
                        backgroundImage: "url('" + this.state.imageFile + "')",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        height: 200
                      }}
                    >
                      <img
                        src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/remove.b30c89f6.svg"
                        alt="remove"
                        style={{ height: 28, width: 28 }}
                        onClick={this.removeImage}
                      />
                    </div>
                  ) : null}
                  <div className="d-flex align-items-center">
                    <img
                      src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/photo.69a470b8.svg"
                      alt="add"
                      className="ml-2 mr-4"
                      style={{ height: 22, width: 22 }}
                      onClick={this.handleImageUpload}
                    />
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={input => (this.inputImage = input)}
                      onChange={this.loadImage}
                    />
                    <button
                      className="btn btn-primary ml-auto"
                      type="button"
                      style={{ borderRadius: 80, margin: 0 }}
                      onClick={this.postTweet}
                      disabled={
                        this.props.wallet === null || this.state.tweet === ""
                      }
                    >
                      {this.state.sendTweetLoad === true ? (
                        <div
                          className="spinner-border text-light mr-2"
                          role="status"
                          style={{ height: 20, width: 20 }}
                        >
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : null}
                      <strong>Tweet</strong>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  Latest Tweets
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
              {this.state.filteredTweets.length === 0
                ? "No Tweets Found"
                : this.state.filteredTweets.map((tweets, index) => (
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
                  ))}
            </div>
          </div>
          <div className="col-md-3">
            <div className="my-3">
              {this.state.filteredTweets.length === 0 ? null : (
                <ul className="list-group">
                  <li className="list-group-item active">
                    <strong>Your neighbours</strong>
                  </li>
                  {this.state.filteredTweets
                    .filter(tweet => tweet.owner !== this.props.walletAddress)
                    .map(tweet => tweet.owner)
                    .filter((tweet, index, arr) => arr.indexOf(tweet) === index)
                    .map(owner => (
                      <li className="list-group-item" key={owner}>
                        <a
                          onClick={e => this.openTweet(owner)}
                          style={{ textDecoration: "none" }}
                        >
                          {owner.substring(0, 12)}
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
