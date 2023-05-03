import React from "react";
import { tab } from "../tabs";
import Navigation from "./Navigation";

interface props {
  setMenuTab: React.Dispatch<React.SetStateAction<tab>>;
  children: Array<JSX.Element> | JSX.Element;
}

const Card: React.FC<props> = ({ children, setMenuTab }: props) => {
  return (
    <div className="bg-cardGrey border-2 border-darkBorder rounded py-6 px-6">
      {/* CARD NAVIGATION */}
      <Navigation setMenuTab={setMenuTab} />
      {children}
    </div>
  );
};

export default Card;
