import * as React from "react";

const Like = props => {
  return (
    <div>
      <div className="row">
        <div className="d-flex align-items-center">
          <div className="col-md-1">
            <img
              src="https://gdr3yb2vzdz4.arweave.net/bWFwI5a_VMjKHAAgItPgYNbBzj7_MrvVPD6b-n5qnd8/static/media/postAvatar.706965c3.svg"
              alt="post avatar"
              className="rounded-circle border border-primary mt-1"
            />
          </div>
          <div className="col-md-11">
            <div className="d-flex align-items-center">
              <div className="mr-1 pl-4">
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
          </div>
        </div>
      </div>
      <hr className="my-2" />
    </div>
  );
};

export default Like;
