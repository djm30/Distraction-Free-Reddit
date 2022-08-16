import React from "react";
import Option from "./Option";

interface Props {
  children?: JSX.Element | Array<JSX.Element>;
}

const Options: React.FC<Props> = ({ children }: Props) => {
  return <div className="mt-12 space-y-6">{children}</div>;
};

export default Options;
