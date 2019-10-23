import React from "react";
import "./App.css";
import Header from "./components/headercomponent";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wallet: null
    };
  }
  setWallet = wallet => {
    this.setState({ wallet });
  };

  render() {
    return (
      <div className="App">
        <Header setWallet={this.setWallet} wallet={this.state.wallet} />
        {this.props.children}
      </div>
    );
  }
}

export default App;
