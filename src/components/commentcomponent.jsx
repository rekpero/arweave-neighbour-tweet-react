import * as React from "react";

const Comment = props => {
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
              <strong>{props.ownerAddress}</strong>
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
          <div className="pl-2 mb-1">{props.comment}</div>
          {props.imageUrl !== null ? (
            <div
              className="ml-2 mb-2 rounded-lg border"
              style={{
                backgroundImage: "url('" + props.imageUrl + "')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                height: 200
              }}
            ></div>
          ) : null}
        </div>
      </div>
      <hr className="my-2" />
    </div>
  );
};

export default Comment;
