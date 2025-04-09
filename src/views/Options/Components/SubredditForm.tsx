import React, { FormEvent, useState } from "react";

interface Props {
  addSubreddit: (subreddit: string) => void;
}

const SubredditForm = ({ addSubreddit }: Props) => {
  const [subReddit, setSubReddit] = useState("r/");

  const onSubRedditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.substring(0, 2) !== "r/") {
      setSubReddit("r/");
    } else if (e.target.value.length >= 2) {
      setSubReddit(e.target.value.toLowerCase());
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    addSubreddit(subReddit.substring(2));
    setSubReddit("r/");
  };

  return (
    <div className="space-y-1">
      <form className="flex flex-col sm:flex-row sm:items-center gap-3" onSubmit={onSubmit}>
        <div className="relative flex-1">
          <input
            maxLength={22}
            value={subReddit}
            onChange={onSubRedditChange}
            placeholder="r/All"
            className={`py-3 pl-4 pr-10 bg-cardLight hover:bg-cardGrey w-full rounded-lg focus:outline-none transition-all border-2 text-white border-transparent focus:border-focusBorder
            `}
          />
          {subReddit.length > 4 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="py-3 px-6 bg-activeButton hover:bg-activeButtonHover transition-all rounded-lg text-white font-medium flex-shrink-0"
        >
          Add Subreddit
        </button>
      </form>
    </div>
  );
};

export default SubredditForm;
