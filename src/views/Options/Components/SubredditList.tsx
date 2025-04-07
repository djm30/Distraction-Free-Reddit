import React, { FormEvent, useState } from "react";
import SingleSubreddit from "./SingleSubreddit";
import SubredditForm from "./SubredditForm";
import styles from "./SubredditList.module.css";

interface Props {
  subreddits: Array<string>;
  addSubreddit: (subreddit: string) => void;
  removeSubreddit: (subreddit: string) => void;
}

const SubredditList = ({ subreddits, addSubreddit, removeSubreddit }: Props) => {
  return (
    <div className="xl:mx-20 lg:mx-10 mx-5 border-2 border-transparent">
      {/* INPUT */}
      <SubredditForm addSubreddit={addSubreddit} />
      {/* SUBREDDIT LIST */}
      <div
        className={`mt-10 relative xl:mx-16 lg:mx-12 md:mx-8 h-80 bg-cardDark rounded-[1.25rem]  ${styles.scrollbar}`}
      >
        {subreddits.length ? (
          <div className={`rounded-[4px] px-2 py-3 overflow-hidden ${styles.subredditList}`}>
            {subreddits.map((subreddit) => (
              <SingleSubreddit name={subreddit} removeSubreddit={removeSubreddit} />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SubredditList;
