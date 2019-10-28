import React from "react";
import photo from "../assets/images/photo.svg";
import postAvatar from "../assets/images/postAvatar.svg";
import remove from "../assets/images/remove.svg";
import autosize from "autosize";
import ApiService from "../services/api";

export default class CommentModal extends React.Component {
  textarea = null;
  inputImage = null;
  closeModal = null;

  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      imageFile: null
    };
  }
  loadComment = event => {
    this.setState({ comment: event.target.value });
  };

  componentDidMount() {
    this.textarea.focus();
    autosize(this.textarea);
  }
  componentDidUpdate() {
    autosize(this.textarea);
  }
  handleImageUpload = () => {
    this.inputImage.click();
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

  commentTweet = async () => {
    let comment = {
      comment: this.state.comment,
      imageFile: this.state.imageFile,
      tweetId: this.props.tweet.txid
    };
    console.log(comment);
    const response = await ApiService.commentTweet(comment, this.props.wallet);
    console.log(response);
    this.props.tweetCommented();
    this.closeModal.click();
  };

  removeImage = () => {
    this.setState({ imageFile: null });
  };
  render() {
    return (
      <div
        className="modal fade"
        id="commentModal"
        role="dialog"
        aria-labelledby="commentModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">Comment</h5>
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
              <div className="row">
                <div className="col-md-1 col-xs-1 col-sm-1">
                  <img
                    src={postAvatar}
                    alt="post avatar"
                    className="rounded-circle border border-primary mt-1"
                  />
                </div>
                <div className="col-md-11 col-xs-11 col-sm-11">
                  <div className="mb-2">
                    <textarea
                      rows={2}
                      ref={c => (this.textarea = c)}
                      placeholder="Tweet your reply"
                      className="border-0 bg-light w-100"
                      style={{ fontSize: 24 }}
                      value={this.state.comment}
                      onChange={this.loadComment}
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
                      onClick={this.commentTweet}
                      disabled={
                        this.props.wallet === null || this.state.comment === ""
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
                      <strong>Comment</strong>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      style={{ display: "none" }}
                      ref={btn => (this.closeModal = btn)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-top-0 bg-light"></div>
          </div>
        </div>
      </div>
    );
  }
}
