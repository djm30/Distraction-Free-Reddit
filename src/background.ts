if (import.meta.env.VITE_BROWSER === "firefox") {
  import("./firefox/background");
} else {
  import("./chrome/background");
}
