import * as React from "react";
import postAvatar from "../assets/images/postAvatar.svg";

const Toast = props => {
  return (
    <div
      className="toast"
      style={{ position: "absolute", top: 84, right: 18 }}
      data-delay="2000"
    >
      <div className="toast-header">
        <img
          src={postAvatar}
          className="rounded mr-2"
          alt="..."
          style={{ height: 20, width: 20 }}
        />
        <strong className="mr-auto mr-5">{props.title}</strong>

        <button
          type="button"
          className="ml-2 mb-1 close"
          data-dismiss="toast"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="toast-body">{props.message}</div>
    </div>
  );
};

export default Toast;
