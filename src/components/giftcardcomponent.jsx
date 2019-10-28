import * as React from "react";
import { Link } from "react-router-dom";
import postAvatar from "../assets/images/postAvatar.svg";
import circle from "../assets/images/circle.svg";
import arweaveIcon from "../assets/images/arweaveIcon.png";

const GiftCard = props => {
  return (
    <div>
      <div className="row">
        <div className="col-md-1">
          <img
            src={postAvatar}
            alt="post avatar"
            className="rounded-circle border border-primary mt-1"
          />
        </div>
        <div className="col-md-11">
          <div className="d-flex align-items-center">
            <div className="mr-1 pl-2">
              <Link
                to={
                  props.walletAddress === props.fromAddress
                    ? "account"
                    : "/neighbour/" + props.fromAddress
                }
                style={{ textDecoration: "none" }}
              >
                <strong>
                  {props.fromAddress.substring(0, 12)}...
                  {props.fromAddress.substring(-4, 4)}
                </strong>
              </Link>
            </div>
            <div className="mr-1">
              <img src={circle} alt="circle" style={{ width: 4, height: 4 }} />
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
                    src={arweaveIcon}
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
                    <Link
                      to={
                        props.walletAddress === props.toAddress
                          ? "account"
                          : "/neighbour/" + props.toAddress
                      }
                      style={{ textDecoration: "none" }}
                      className="text-white"
                    >
                      {props.toAddress.substring(0, 12)}...
                      {props.toAddress.substring(-4, 4)}
                    </Link>
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
