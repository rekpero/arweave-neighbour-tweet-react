import * as React from "react";

const GiftCard = props => {
  const openTweetFrom = () => {
    if (props.walletAddress === props.fromAddress) {
      props.setTab(1);
    } else {
      props.setId(props.fromAddress);
      props.setTab(2);
    }
  };
  const openTweetTo = () => {
    if (props.walletAddress === props.toAddress) {
      props.setTab(1);
    } else {
      props.setId(props.toAddress);
      props.setTab(2);
    }
  };
  return (
    <div>
      <div className="row">
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
              <a onClick={openTweetFrom} style={{ textDecoration: "none" }}>
                <strong>
                  {props.fromAddress.substring(0, 12)}...
                  {props.fromAddress.substring(-4, 4)}
                </strong>
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
          <div className="my-2 ml-2 rounded p-3 border shadow bg-light">
            <div className="row">
              <div className="col-md-6">
                <div style={{ fontSize: 18 }} className="mt-2 text-center">
                  <strong>GIFT CARD</strong>
                </div>
                <div className="text-center mt-2">
                  <img
                    src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/arweaveIcon.98838ebc.png"
                    alt="arweave icon"
                    style={{ height: 60, width: 60 }}
                    className="rounded-circle border border-primary"
                  />
                </div>
                <div className="text-center my-2" style={{ fontSize: 24 }}>
                  <strong>{props.amount} AR</strong>
                </div>
              </div>
              <div className="col-md-6">
                <div className="text-center mt-2">
                  <strong>to: </strong>
                  <span className="badge badge-primary">
                    <a
                      onClick={openTweetTo}
                      style={{ textDecoration: "none" }}
                      className="text-white"
                    >
                      {props.toAddress.substring(0, 12)}...
                      {props.toAddress.substring(-4, 4)}
                    </a>
                  </span>
                </div>
                <div className="text-secondary text-center my-2 overflow-auto">
                  <strong>{props.note}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2" />
    </div>
  );
};
export default GiftCard;
