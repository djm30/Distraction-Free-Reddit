import React from "react";

interface Props {
  children?: JSX.Element | Array<JSX.Element>;
}

const Options: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="max-w-5xl mx-auto mt-12 bg-cardDark rounded-lg p-4 border border-gray-800   ">
      <div>{children}</div>
    </div>
  );
};

export default Options;
