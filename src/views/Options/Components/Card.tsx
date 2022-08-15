import React from "react";
import { useState } from "react";
import Navigation from "./Navigation";

interface props {
  children: JSX.Element;
}

const Card: React.FC<props> = ({ children }: props) => {
  const [navigation, setNavigation] = useState<string>("general");

  return (
    <div className="bg-cardGrey border-2 border-darkBorder h-[600px]  rounded py-6 px-6">
      {/* CARD NAVIGATION */}
      <Navigation setNavigation={setNavigation} />
      {children}
    </div>
  );
};

export default Card;
