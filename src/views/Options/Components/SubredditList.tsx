import React, { FormEvent, useState } from "react";
import SingleSubreddit from "./SingleSubreddit";
import SubredditForm from "./SubredditForm";
import styles from "./SubredditList.module.css";

interface Props {
  subreddits: Array<string>;
  addSubreddit: (subreddit: string) => void;
  removeSubreddit: (subreddit: string) => void;
}

const SubredditList = ({
  subreddits,
  addSubreddit,
  removeSubreddit,
}: Props) => {
  return (
    <div className="xl:mx-20 lg:mx-10 mx-5 border-2 border-transparent h-[450px]">
      {/* INPUT */}
      <SubredditForm addSubreddit={addSubreddit} />
      {/* SUBREDDIT LIST */}
      <div
        className={`mt-10 relative xl:mx-16 lg:mx-12 md:mx-8 h-80  ${styles.scrollbar}`}
      >
        <div
          className={`border-2 min-h-[70px] border-darkBorder rounded-[4px] overflow-hidden ${styles.subredditList}`}
        >
          {subreddits.map((subreddit) => (
            <SingleSubreddit
              name={subreddit}
              removeSubreddit={removeSubreddit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubredditList;
