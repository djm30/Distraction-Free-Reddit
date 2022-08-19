import React from "react";
import { useState } from "react";
import Card from "./Components/Card";
import "./App.css";
import GeneralOptions from "./Components/GeneralOptions";
import Whitelist from "./Components/Whitelist";
import Blacklist from "./Components/Blacklist";
import Header from "./Components/Header";
import Container from "./Components/Container";
import { tab } from "./tabs";

function App() {
  const [menuTab, setMenuTab] = useState(tab.GENERAL);

  let showOptions = false;
  let showWhitelist = false;
  let showBlacklist = false;

  switch (menuTab) {
    case tab.GENERAL:
      showOptions = true;
      break;
    case tab.WHITELIST:
      showWhitelist = true;
      break;
    case tab.BLACKLIST:
      showBlacklist = true;
  }

  // let optionsToShow: JSX.Element;
  // switch (menuTab) {
  //   case tab.GENERAL:
  //     optionsToShow = <GeneralOptions />;
  //     break;
  //   case tab.WHITELIST:
  //     optionsToShow = <Whitelist />;
  //     break;
  //   case tab.BLACKLIST:
  //     optionsToShow = <Blacklist />;
  // }

  return (
    <Container>
      {/* HEADING */}
      <Header />
      {/* CARD */}
      <Card setMenuTab={setMenuTab}>
        <GeneralOptions show={showOptions} />
        <Whitelist menuTab={menuTab} show={showWhitelist} />
        <Blacklist menuTab={menuTab} show={showBlacklist} />
      </Card>
    </Container>
  );
}

export default App;
