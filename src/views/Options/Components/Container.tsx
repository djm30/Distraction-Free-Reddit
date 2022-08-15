import React from "react";

interface props {
  children: JSX.Element[];
}
const Container: React.FC<props> = ({ children }: props) => {
  return (
    <div className="container mx-auto">
      <div className=" 2xl:mx-72 lg:mx-60 md:mx-28 sm:mx-20 mx-10 ">
        {children}
      </div>
    </div>
  );
};

export default Container;
