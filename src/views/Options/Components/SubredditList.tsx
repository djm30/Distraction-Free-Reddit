import React, { FormEvent, useState } from "react";
import SingleSubreddit from "./SingleSubreddit";
import SubredditForm from "./SubredditForm";
import styles from "./SubredditList.module.css";

const SubredditList = () => {
  return (
    <div className="mx-20 border-2 border-transparent h-[450px]">
      {/* INPUT */}
      <SubredditForm />
      {/* SUBREDDIT LIST */}
      <div className="mt-10 ml-20 mr-10 h-80  overflow-y-scroll scrollbar-track-cardGrey hover:scrollbar-track-cardGrey scrollbar-thumb-black ">
        <div
          className={`border-2 mr-10 min-h-[70px] border-darkBorder rounded-[4px] ${styles.subredditList}`}
        >
          <SingleSubreddit />
        </div>
      </div>
    </div>
  );
};

export default SubredditList;
