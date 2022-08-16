import React from "react";
import Option from "./Option";
import Options from "./Options";
import SubredditList from "./SubredditList";

const Blacklist = () => {
  document.title = "DFReddit - Blacklist";
  return (
    <Options>
      <Option
        title={"Enable Blacklist Mode"}
        description={"Block access to certain subreddits you choose"}
      />
      <SubredditList />
    </Options>
  );
};

export default Blacklist;
