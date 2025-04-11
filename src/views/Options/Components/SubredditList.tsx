import React from "react";
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
    <div className="w-full border-transparent">
      <SubredditForm addSubreddit={addSubreddit} />

      <div className="mt-6 bg-cardDark rounded-lg  border-0">
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Subreddits</h3>
          <span className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-full">{subreddits.length}</span>
        </div>

        <div className={`h-64 overflow-y-auto ${styles.scrollbar}`}>
          {subreddits.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {subreddits.map((subreddit) => (
                <SingleSubreddit key={subreddit} name={subreddit} removeSubreddit={removeSubreddit} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <p className="mt-2">No subreddits added yet</p>
              <p className="text-sm">Add subreddits using the form above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubredditList;
