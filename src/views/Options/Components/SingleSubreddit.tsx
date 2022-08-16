import React from "react";

const SingleSubreddit = () => {
  return (
    <div className="flex  last-of-type:border-b-0 items-center justify-between border-b-2 border-darkBorder py-4 px-3 text-white text-2xl">
      <p>r/All</p>
      <svg
        className="fill-neutral-400 hover:fill-white cursor-pointer "
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M8.25 8.25A.75.75 0 0 1 9 9v9a.75.75 0 1 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm3.75 0a.75.75 0 0 1 .75.75v9a.75.75 0 1 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm4.5.75A.75.75 0 1 0 15 9v9a.75.75 0 1 0 1.5 0V9Z" />
        <path
          fill-rule="evenodd"
          d="M21.75 4.5a1.5 1.5 0 0 1-1.5 1.5h-.75v13.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3V6h-.75a1.5 1.5 0 0 1-1.5-1.5V3a1.5 1.5 0 0 1 1.5-1.5H9A1.5 1.5 0 0 1 10.5 0h3A1.5 1.5 0 0 1 15 1.5h5.25a1.5 1.5 0 0 1 1.5 1.5v1.5ZM6.177 6 6 6.088V19.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V6.088L17.823 6H6.177ZM3.75 4.5V3h16.5v1.5H3.75Z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  );
};

export default SingleSubreddit;
