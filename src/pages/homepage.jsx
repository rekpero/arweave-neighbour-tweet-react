import React from "react";
import photo from "../assets/images/photo.svg";
import postAvatar from "../assets/images/postAvatar.svg";
import remove from "../assets/images/remove.svg";
import autosize from "autosize";
import ApiService from "../services/api";
import Toast from "../components/toastcomponent";
import $ from "jquery";

export default class HomePage extends React.Component {
  textarea = null;
  inputImage = null;
  constructor(props) {
    super(props);
    this.state = {
      tweet: "",
      imageFile: null,
      sendTweetLoad: false
    };
  }

  componentDidMount() {
    this.textarea.focus();
    autosize(this.textarea);
    this.logTweet = setInterval(async () => {
      console.log(await ApiService.getAllTweets());
    }, 10000);
  }
  componentDidUpdate() {
    autosize(this.textarea);
  }

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

  removeImage = () => {
    this.setState({ imageFile: null, imageUrl: "" });
  };

  postTweet = async () => {
    this.setState({ sendTweetLoad: true });
    console.log({ tweet: this.state.tweet, imageFile: this.state.imageFile });
    const response = await ApiService.postTweet(
      { tweet: this.state.tweet, imageFile: this.state.imageFile },
      this.props.wallet
    );
    console.log(response);
    this.setState(
      {
        sendTweetLoad: false,
        tweet: "",
        imageFile: null,
        imageUrl: ""
      },
      () => {
        $(".toast").toast("show");
      }
    );
  };

  componentWillUnmount() {
    clearInterval(this.logTweet);
  }
  render() {
    return (
      <div className="container">
        <Toast title={"Tweet"} message={"Yea! Tweet posted"}></Toast>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div className="my-3 rounded p-3 border shadow bg-light">
              <div className="row">
                <div className="col-md-1">
                  <img
                    src={postAvatar}
                    alt="post avatar"
                    className="rounded-circle border border-primary mt-1"
                  />
                </div>
                <div className="col-md-11">
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
                        height: 200,
                        width: "100%"
                      }}
                    >
                      <img
                        src={remove}
                        alt="remove"
                        style={{ height: 28, width: 28 }}
                        onClick={this.removeImage}
                      />
                    </div>
                  ) : null}
                  <div className="d-flex align-items-center">
                    <img
                      src={photo}
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
                      disabled={this.props.wallet === null}
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
          </div>
        </div>
      </div>
    );
  }
}
