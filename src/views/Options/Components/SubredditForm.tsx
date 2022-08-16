import React, { FormEvent, useState } from "react";

const SubredditForm = () => {
  const [subReddit, setSubReddit] = useState("r/");

  const onSubRedditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length >= 2) {
      setSubReddit(e.target.value);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (subReddit.length >= 2) {
      setSubReddit("r/");
    }
  };

  return (
    <form
      className="mt-5  mx-20 space-x-4 flex text-white text-base"
      onSubmit={onSubmit}
    >
      <button className="py-4 px-14 bg-buttonBlue hover:bg-[#118ff0] transition-all rounded-[4px]">
        Add
      </button>
      <input
        value={subReddit}
        onChange={onSubRedditChange}
        placeholder="r/All"
        className="py-4 px-10 bg-cardLight w-full rounded-[4px] border-2 border-darkBorder focus:outline-none focus:border-lightBorder"
      />
    </form>
  );
};

export default SubredditForm;
