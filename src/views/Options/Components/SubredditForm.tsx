import React, { FormEvent, useState } from "react";

interface Props {
  addSubreddit: (subreddit: string) => void;
}

const SubredditForm = ({ addSubreddit }: Props) => {
  const [subReddit, setSubReddit] = useState("r/");

  const validateSubreddit = () =>
    /^(r\/)[a-zA-Z\d][a-zA-Z\d_]{1,19}$/.test(subReddit);

  const onSubRedditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.substring(0, 2) !== "r/") {
      setSubReddit("r/");
    } else if (e.target.value.length >= 2) {
      setSubReddit(e.target.value);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (subReddit.length >= 2) {
      setSubReddit("r/");
    }
    if (validateSubreddit()) {
      addSubreddit(subReddit.substring(2));
      setSubReddit("");
    }
  };

  return (
    <form
      className="mt-5  xl:mx-16 lg:mx-12 md:mx-8 space-x-4 flex text-white text-base"
      onSubmit={onSubmit}
    >
      <button className="py-4 px-14 bg-buttonBlue hover:bg-[#118ff0] transition-all rounded-[4px]">
        Add
      </button>
      <input
        maxLength={22}
        value={subReddit}
        onChange={onSubRedditChange}
        placeholder="r/All"
        className="py-4 px-10 bg-cardLight w-full rounded-[4px] border-2 border-darkBorder focus:outline-none focus:border-lightBorder"
      />
    </form>
  );
};

export default SubredditForm;
