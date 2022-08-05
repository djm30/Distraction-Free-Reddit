document.cookie
  .split(";")
  .find((cookie) => cookie.includes("_recentclicks"))
  .split("_")[0];
