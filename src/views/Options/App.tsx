import React from "react";
import { useState } from "react";
import Card from "./Components/Card";
import "./App.css";
import Options from "./Components/Options";
import Header from "./Components/Header";
import Container from "./Components/Container";

type menu = "general" | "whitelist" | "blacklist";

function App() {
  const [menuTab, setMenuTab] = useState();

  return (
    <Container>
      {/* HEADING */}
      <Header />
      {/* CARD */}
      <Card>
        <Options />
      </Card>
    </Container>
  );
}

export default App;
