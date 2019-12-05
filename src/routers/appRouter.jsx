import * as React from "react";
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
          : sessionStorage.getItem("walletAddress"),
      tab: 0,
      id: ""
    };
  }
  async componentDidMount() {
    const walletAmount = await ApiService.getWalletAmount(
      this.state.walletAddress
    );
    console.log(walletAmount);
    this.setState({ walletAmount });
  }
  setWallet = async (wallet, walletAddress) => {
    sessionStorage.setItem("wallet", JSON.stringify(wallet));
    sessionStorage.setItem("walletAddress", walletAddress);
    const walletAmount = await ApiService.getWalletAmount(walletAddress);
    this.setState({ wallet, walletAddress, walletAmount });
  };

  logout = () => {
    sessionStorage.removeItem("wallet");
    sessionStorage.removeItem("walletAddress");
    this.setState({ wallet: null, walletAmount: 0, walletAddress: "" });
  };

  setTab = tab => {
    this.setState({ tab });
  };
  setId = id => {
    this.setState({ id });
  };
  render() {
    return (
      <App
        wallet={this.state.wallet}
        walletAddress={this.state.walletAddress}
        walletAmount={this.state.walletAmount}
        setWallet={this.setWallet}
        logout={this.logout}
        setTab={this.setTab}
        tab={this.state.tab}
      >
        {this.state.tab === 0 ? (
          <HomePage
            wallet={this.state.wallet}
            walletAddress={this.state.walletAddress}
            setTab={this.setTab}
            setId={this.setId}
          />
        ) : null}
        {this.state.tab === 1 ? (
          this.state.wallet !== null ? (
            <AccountPage
              wallet={this.state.wallet}
              walletAddress={this.state.walletAddress}
              setTab={this.setTab}
              setId={this.setId}
            />
          ) : (
            this.setTab(0)
          )
        ) : null}
        {this.state.tab === 2 ? (
          <NeighbourPage
            wallet={this.state.wallet}
            walletAddress={this.state.walletAddress}
            id={this.state.id}
          />
        ) : null}
      </App>
    );
  }
}
export default AppRouter;
