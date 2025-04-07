import React from "react";
import { tab } from "../tabs";
import Navigation from "./Navigation";

interface props {
  setMenuTab: React.Dispatch<React.SetStateAction<tab>>;
  children: Array<JSX.Element> | JSX.Element;
}

const Card: React.FC<props> = ({ children, setMenuTab }: props) => {
  return (
    <div className="rounded py-6 px-6 mb-2">
      {/* CARD NAVIGATION */}
      <Navigation setMenuTab={setMenuTab} />
      {children}
    </div>
  );
};

export default Card;
