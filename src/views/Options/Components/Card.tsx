import React from "react";

interface props {
  children: JSX.Element;
}

const Card: React.FC<props> = ({ children }: props) => {
  return (
    <div className="bg-cardGrey border-2 border-darkBorder h-[600px]  rounded py-6 px-6">
      {/* CARD NAVIGATION */}
      <div className="border-darkBorder border-b-2 space-x-4 mt-2 pb-2 text-darkText font-bold">
        <span className="text-white border-b-4 py-1 border-white">General</span>
        <span>Whitelist</span>
        <span>Blacklist</span>
      </div>
      {children}
    </div>
  );
};

export default Card;
