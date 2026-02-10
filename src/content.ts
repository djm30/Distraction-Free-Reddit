if (import.meta.env.VITE_BROWSER === "firefox") {
  import("./firefox/content");
} else {
  import("./chrome/content");
}
