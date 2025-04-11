import React from "react";

interface Props {
  name: string;
  removeSubreddit: (subreddit: string) => void;
}

const SingleSubreddit = ({ name, removeSubreddit }: Props) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-black/20 group transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {name.substring(0, 1).toUpperCase()}
        </div>
        <p className="text-white text-base font-medium">r/{name}</p>
      </div>

      <button
        onClick={() => removeSubreddit(name)}
        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-red-500/20 transition-colors"
        aria-label="Remove subreddit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};

export default SingleSubreddit;
