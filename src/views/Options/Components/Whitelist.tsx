import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";

const Whitelist = () => {
  document.title = "DFReddit - Whitelist";
  return (
    <Options>
      <Option
        title={"Enable Whitelist Mode"}
        description={"Allow access only to the subreddits you choose"}
      />
      <SubredditList />
    </Options>
  );
};

export default Whitelist;
