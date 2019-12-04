import * as React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/images/avatar.svg";
import logo from "../assets/images/logo.svg";
import ApiService from "../services/api";

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

    let address = await ApiService.getWalletAddress(jwk);
    props.setWallet(jwk, address);
  };
  console.log(parseFloat(ApiService.convertToAr(props.walletAmount)));
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="logo"
              style={{ height: 32, width: 32 }}
              className="mr-2"
            />
            <strong>Ar Neighbour</strong>
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
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <strong>Home</strong>
                </Link>
              </li>
              <li className="nav-item">
                {props.wallet !== null ? (
                  <Link className="nav-link" to="/account">
                    <strong>Account</strong>
                  </Link>
                ) : null}
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {props.wallet !== null ? (
                <li className="nav-item d-flex mx-3 dropdown">
                  <div
                    className="nav-link dropdown-toggle align-self-center"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img
                      src={avatar}
                      alt="avatar"
                      style={{ height: 32, width: 32 }}
                      className=" rounded border border-primary"
                    />
                  </div>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <div
                      className="dropdown-item text-center"
                      style={{ margin: 0 }}
                    >
                      <a
                        className="d-flex align-items-end justify-content-center"
                        href={
                          "https://viewblock.io/arweave/address/" +
                          props.walletAddress
                        }
                        style={{ textDecoration: "none" }}
                      >
                        <span style={{ fontSize: 28, fontWeight: 600 }}>
                          {parseFloat(
                            ApiService.convertToAr(props.walletAmount)
                          ).toFixed(2)}{" "}
                          AR
                        </span>
                      </a>
                      <div className="badge badge-primary text-left">
                        {props.walletAddress.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </li>
              ) : null}

              <li className="nav-item d-flex">
                {props.wallet === null ? (
                  <button
                    type="button"
                    className="btn btn-primary align-self-center"
                    data-toggle="modal"
                    data-target="#loginModal"
                  >
                    <strong>LOG IN</strong>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary align-self-center"
                    onClick={e => props.logout()}
                  >
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
