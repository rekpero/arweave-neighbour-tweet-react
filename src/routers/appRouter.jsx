import * as React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/homepage";
import ApiService from "../services/api";
import NeighbourPage from "../pages/neighbourpage";
import AccountPage from "../pages/accountpage";

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet:
        sessionStorage.getItem("wallet") === null
          ? null
          : JSON.parse(sessionStorage.getItem("wallet")),
      walletAmount: 0,
      walletAddress:
        sessionStorage.getItem("walletAddress") === null
          ? ""
          : sessionStorage.getItem("walletAddress")
    };
  }
  async componentDidMount() {
    const walletAmount = await ApiService.getWalletAmount(
      this.state.walletAddress
    );
    console.log(walletAmount);
    this.setState({ walletAmount });
  }
  setWallet = (wallet, walletAddress) => {
    sessionStorage.setItem("wallet", JSON.stringify(wallet));
    sessionStorage.setItem("walletAddress", walletAddress);
    this.setState({ wallet, walletAddress });
  };

  logout = () => {
    sessionStorage.removeItem("wallet");
    sessionStorage.removeItem("walletAddress");
    this.setState({ wallet: null, walletAmount: 0, walletAddress: "" });
  };
  render() {
    return (
      <Router>
        <App
          wallet={this.state.wallet}
          walletAddress={this.state.walletAddress}
          walletAmount={this.state.walletAmount}
          setWallet={this.setWallet}
          logout={this.logout}
        >
          <Route
            exact
            path="/"
            render={() => (
              <HomePage
                wallet={this.state.wallet}
                walletAddress={this.state.walletAddress}
              />
            )}
          />
          <Route
            exact
            path="/neighbour/:id"
            render={props => (
              <NeighbourPage
                wallet={this.state.wallet}
                walletAddress={this.state.walletAddress}
                {...props}
              />
            )}
          />
          <Route
            exact
            path="/account"
            render={() =>
              this.state.wallet !== null ? (
                <AccountPage
                  wallet={this.state.wallet}
                  walletAddress={this.state.walletAddress}
                />
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </App>
      </Router>
    );
  }
}
export default AppRouter;
