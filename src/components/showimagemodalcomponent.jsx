import * as React from "react";

const ShowImageModal = props => {
  return (
    <div
      className="modal fade"
      id="showImageModal"
      role="dialog"
      aria-labelledby="showImageModal"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content"
          style={{
            backgroundImage: "url('" + props.imageUrl + "')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            height: 400
          }}
        ></div>
      </div>
    </div>
  );
};

export default ShowImageModal;
