import React from "react";
import Header from "./components/headercomponent";
import "./App.css";

const App = props => {
  return (
    <div className="App">
      <Header
        setWallet={props.setWallet}
        wallet={props.wallet}
        walletAddress={props.walletAddress}
        walletAmount={props.walletAmount}
        logout={props.logout}
      />
      {props.children}
    </div>
  );
};

export default App;
