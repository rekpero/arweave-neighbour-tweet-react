import * as React from "react";
import postAvatar from "../assets/images/postAvatar.svg";
import circle from "../assets/images/circle.svg";

const Like = props => {
  return (
    <div>
      <div className="row">
        <div className="d-flex align-items-center">
          <div className="col-md-1">
            <img
              src={postAvatar}
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
                  src={circle}
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
