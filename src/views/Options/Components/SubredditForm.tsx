import React, { FormEvent, useEffect, useState } from "react";

interface Props {
  addSubreddit: (subreddit: string) => void;
}

const SubredditForm = ({ addSubreddit }: Props) => {
  const [subReddit, setSubReddit] = useState("r/");
  const [error, setError] = useState("");

  const validateSubreddit = (value: string) => {
    const regex = /^(r\/)[a-zA-Z\d][a-zA-Z\d_]{1,20}$/;
    const isValid = regex.test(value);

    if (!isValid && value.length > 2) {
      setError("Enter a valid subreddit");
    } else {
      setError("");
    }

    return isValid;
  };

  useEffect(() => {
    if (subReddit.length > 2) {
      validateSubreddit(subReddit);
    }
  }, [subReddit]);

  const onSubRedditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.substring(0, 2) !== "r/") {
      setSubReddit("r/");
    } else {
      setSubReddit(inputValue.toLowerCase());
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateSubreddit(subReddit)) {
      addSubreddit(subReddit.substring(2));
      setSubReddit("r/");
      setError("");
    }
  };

  return (
    <div className="space-y-1">
      <form className="flex flex-col sm:flex-row sm:items-center gap-3" onSubmit={onSubmit}>
        <div className="relative flex-1">
          <input
            maxLength={23}
            value={subReddit}
            onChange={onSubRedditChange}
            placeholder="r/All"
            className={`py-3 pl-4 pr-10 bg-cardLight hover:bg-cardGrey w-full rounded-lg focus:outline-none transition-all border-2 text-white ${
              error ? "border-red-500" : "border-transparent focus:border-focusBorder"
            }`}
          />
          {subReddit.length > 3 && !error && (
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
      {error && <p className="text-red-500 text-sm pl-1">{error}</p>}
    </div>
  );
};

export default SubredditForm;
