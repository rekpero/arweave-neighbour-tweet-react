import React from "react";
import ApiService from "../services/api";

export default class SendGiftCardModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      note: "",
      sendGiftCardLoad: false
    };
  }
  loadAmount = event => {
    this.setState({ amount: event.target.value });
  };
  loadNote = event => {
    if (event.target.value.length <= 60) {
      this.setState({ note: event.target.value });
    }
  };

  sendGiftCard = async () => {
    this.setState({ sendGiftCardLoad: true });
    const response = await ApiService.sendGiftCard(
      this.props.sendAddress,
      this.state.amount,
      this.state.note,
      this.props.wallet
    );
    console.log(response);
    this.setState({ sendGiftCardLoad: false });
    this.closeModal.click();
  };

  render() {
    return (
      <div
        className="modal fade"
        id="sendGiftCardModal"
        role="dialog"
        aria-labelledby="sendGiftCardModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-light">
              <h5 className="modal-title">Send Gift Card</h5>
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
              <div>
                <strong>To:</strong>{" "}
                <span className="badge badge-primary">
                  {this.props.sendAddress}
                </span>
              </div>
              <div className="mt-3">
                <label>
                  <strong>Amount (in AR)</strong>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0 Ar"
                  value={this.state.amount}
                  onChange={this.loadAmount}
                ></input>
              </div>
              <div className="mt-3">
                <label>
                  <strong>Note (max 60 words)</strong>
                </label>
                <textarea
                  className="form-control"
                  placeholder="write a note to your neighbour"
                  rows="2"
                  value={this.state.note}
                  onChange={this.loadNote}
                ></textarea>
              </div>
              <div className="d-flex align-items-center mt-3">
                <button
                  className="btn btn-primary ml-auto"
                  type="button"
                  style={{ borderRadius: 80, margin: 0 }}
                  onClick={this.sendGiftCard}
                >
                  {this.state.sendGiftCardLoad ? (
                    <div
                      className="spinner-border text-light mr-2"
                      role="status"
                      style={{ height: 20, width: 20 }}
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : null}

                  <strong>Send</strong>
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
            <div className="modal-footer border-top-0 bg-light"></div>
          </div>
        </div>
      </div>
    );
  }
}
