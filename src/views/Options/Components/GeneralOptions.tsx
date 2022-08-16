import React from "react";
import Options from "./Options";
import Option from "./Option";

const GeneralOptions = () => {
  document.title = "DFReddit - General";
  return (
    <Options>
      <Option
        title={"Hide Main Feed"}
        description={"Hides the main feed on the homepage"}
      />
      <Option
        title={"Hide r/All"}
        description={"Hides any post in the r/All subreddit"}
      />
      <Option
        title={"Hide User Feeds"}
        description={"Hides feed shown when you click onto a user's profile"}
      />
      <Option
        title={"Hide Trending Tab"}
        description={"Hides the trending sidebar on the side of the homepage"}
      />
      <Option
        title={"Hide Full Search Results"}
        description={
          "Hides full page results after searching and pressing enter"
        }
      />
      <Option
        title={"Hide Comments"}
        description={"Hides all comments under posts"}
      />
    </Options>
  );
};

export default GeneralOptions;
