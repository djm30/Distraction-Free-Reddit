import React, { FormEvent, useState } from "react";

interface Props {
  addSubreddit: (subreddit: string) => void;
}

const SubredditForm = ({ addSubreddit }: Props) => {
  const [subReddit, setSubReddit] = useState("r/");

  const validateSubreddit = () => /^(r\/)[a-zA-Z\d][a-zA-Z\d_]{1,19}$/.test(subReddit);

  const onSubRedditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.substring(0, 2) !== "r/") {
      setSubReddit("r/");
    } else if (e.target.value.length >= 2) {
      setSubReddit(e.target.value.toLowerCase());
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
    <form className="mt-5  xl:mx-16 lg:mx-12 md:mx-8 space-x-4 flex text-importantText text-base" onSubmit={onSubmit}>
      <button className="py-4 px-14 bg-activeButton hover:bg-activeButtonHover transition-all rounded-full">Add</button>
      <input
        maxLength={22}
        value={subReddit}
        onChange={onSubRedditChange}
        placeholder="r/All"
        className="py-4 px-10 bg-cardLight hover:bg-cardGrey w-full rounded-full focus:outline-none border-2 border-transparent focus:border-focusBorder"
      />
    </form>
  );
};

export default SubredditForm;
