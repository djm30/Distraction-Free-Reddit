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

  let optionsToShow: JSX.Element;
  switch (menuTab) {
    case tab.GENERAL:
      optionsToShow = <GeneralOptions />;
      break;
    case tab.WHITELIST:
      optionsToShow = <Whitelist />;
      break;
    case tab.BLACKLIST:
      optionsToShow = <Blacklist />;
  }

  return (
    <Container>
      {/* HEADING */}
      <Header />
      {/* CARD */}
      <Card setMenuTab={setMenuTab}>{optionsToShow}</Card>
    </Container>
  );
}

export default App;
