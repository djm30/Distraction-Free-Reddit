import React from "react";

interface props {
  children: JSX.Element[];
}
const Container: React.FC<props> = ({ children }: props) => {
  return (
    <div className="container mx-auto">
      <div className=" 2xl:mx-72 xl:mx-60 lg:mx-40 md:mx-24 sm:mx-16 mx-10 ">
        {children}
      </div>
    </div>
  );
};

export default Container;
