import * as React from "react";
import { Link } from "react-router-dom";
import arweave from "../services/arweave";

const Header = props => {
  let closeBtn;
  let loadPrivateKey = event => {
    handleFile(event.target.files[0]);

    closeBtn.click();
  };
  // load file to json
  let handleFile = file => {
    let fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  // set pk json to state
  let handleFileRead = async e => {
    const jwk = JSON.parse(e.target.result);
    props.setWallet(jwk);
    let address = await arweave.wallets.jwkToAddress(jwk);
    sessionStorage.setItem("wallet", e.target.result);
    console.log(address);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <strong>NEIGHBOUR TWEET</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div id="navbarNavDropdown" className="navbar-collapse collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {props.wallet === null ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-toggle="modal"
                    data-target="#loginModal"
                  >
                    <strong>LOG IN</strong>
                  </button>
                ) : (
                  <button type="button" className="btn btn-primary">
                    <strong>LOG OUT</strong>
                  </button>
                )}
              </li>
            </ul>
          </div>
          <div
            className="modal fade"
            id="loginModal"
            role="dialog"
            aria-labelledby="loginModal"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="text-left mb-4">
                    <h4>Log in with Arweave wallet</h4>
                  </div>
                  <div className="mb-4">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        onChange={loadPrivateKey}
                      />
                      <label className="custom-file-label text-left">
                        Choose file
                      </label>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-dismiss="modal"
                      ref={btn => {
                        closeBtn = btn;
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
