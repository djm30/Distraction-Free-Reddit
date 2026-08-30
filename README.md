# Distraction Free Reddit

Distraction Free Reddit is a Chrome extension designed to help users to engage with Reddit more intentionally. With this extension, users can block off parts of the site that they find most distracting, allowing them to cut out mindless scrolling and focus on the content that matters to them.

Note: This works with the Reddit redesign only. Old Reddit (`old.reddit.com`) is not supported — the extension detects it and disables itself.
<hr/>

## Installation

To install the extension, follow these steps:
1. Go to the Chrome Web Store and search for "Distraction Free Reddit"
2. Click the "Add to Chrome" button
3. Click "Add Extension" to confirm the installation


### Building locally

Requires **Node 22 or newer** (Vite 7 needs `^20.19.0 || >=22.12.0`). No other toolchain is needed.

```bash
npm ci                    # install exactly what the lockfile specifies
npm run build:chrome      # -> build_chrome/
npm run build:firefox     # -> build_firefox/
npm run build:both        # both of the above
```

Each build writes an unpacked extension to a `build_[BROWSER_NAME]` folder at the top level. Load it in your browser:

- **Chrome** — `chrome://extensions`, enable Developer mode, "Load unpacked", select `build_chrome`
- **Firefox** — `about:debugging#/runtime/this-firefox`, "Load Temporary Add-on", select any file inside `build_firefox`

Chrome and Firefox build from separate manifests (`src/chrome/manifest.json` and `src/firefox/manifest.json`), so it is worth building both when changing anything manifest-related.

### Development

```bash
npm run dev:chrome        # vite dev server
npm run dev:firefox
npm run typecheck         # tsc --noEmit
npm test                  # vitest run
npm run test:watch        # vitest in watch mode
```

`npm run build:*` uses esbuild and does **not** typecheck, so run `npm run typecheck` separately. CI runs typecheck, tests and both builds on every pull request.

<hr/>

## Usage

1. Install the extension in your browser (see installation instructions).
2. Click on the extension icon in your browser toolbar to open the options menu.
3. Enable the extension
4. Click on the options button to open the settings
5. Choose the settings you want to apply to your Reddit browsing experience, including hiding the main feed, hiding certain subreddits, and enabling whitelist or blacklist modes.

Changes take effect immediately on any open Reddit tab — no refresh needed.

<hr/>

## Features

Distraction Free Reddit allows you to customize your Reddit experience by hiding various parts of the site that can lead to mindless scrolling and distract you from your goals. Here are some of the features:

- **Hide main feed**: Hide the main feed of posts on the Reddit homepage, to help you avoid getting sucked into endless scrolling.
- **Hide r/all and r/popular**: Hide the r/all and r/popular feeds, which can be sources of distractions and time-wasting content.
- **Hide Explore**: Hide the Explore page used to browse topics and communities.
- **Hide subreddit feeds**: Hide subreddit feeds so only individual posts remain reachable.
- **Hide user profiles**: Hide other people's profile pages. Your own profile stays visible.
- **Hide full page search**: Hide full page search results, which can be a source of distractions.
- **Hide trending news**: Hide the trending suggestions that appear when you click the search bar.
- **Hide sidebar**: Hide the sidebar on the homepage and subreddit feeds, which can contain distracting or irrelevant information.
- **Hide comments**: Hide the comment sections on posts, which can be a source of time-wasting debates or irrelevant information.
- **Hide videos**: Hide videos and gifs, with per-subreddit exemptions via your whitelist.
- **Hide notifications**: Hide the inbox indicator and the notifications page.
- **Hide the Reddit logo** in the page header.
- **Whitelist mode**: Only allow access to subreddits you specify. This can help you focus on content that is relevant to your interests or goals.
- **Blacklist mode**: Block access to subreddits you find distracting or unhelpful. This can help you avoid time-wasting content and stay focused on your goals.

Ads are always hidden while the extension is enabled.

These settings will hopefully allow you to use reddit in a more intentional way and encourage a healthier relationship with the site.
<hr/>

## How it works

Blocking is done with CSS, not by manipulating Reddit's DOM.

`src/styles/blocker.css` is injected by the manifest at `document_start`, before Reddit's markup exists. The content script never hides elements itself — it decides which blocks apply and toggles `data-dfr-*` attributes on the `<html>` element. The stylesheet's `html[data-dfr-hide-x] <selector>` rules do all the matching, including for elements Reddit renders later.

```
URL + settings  ->  computeBlocks()  ->  applyBlocks()  ->  blocker.css
                    pure, testable       sets attributes    hides elements
                                         on <html>
```

- `src/common/blocks/compute-blocks.ts` — the single decision point. Pure function, no DOM, covered by tests.
- `src/common/blocks/apply-blocks.ts` — the only module that writes to the DOM.
- `src/styles/blocker.css` — where every selector lives.
- `src/common/util/url-parser.ts` — classifies a URL into a `PageType`.

Two things CSS can't do on its own, each isolated in its own module: video rules depend on the user's whitelist so they're generated at runtime, and trending news lives inside a shadow root so a small stylesheet is injected there instead.

Settings are stored with `storage.sync` and propagate to open tabs through `storage.onChanged`. The background script only seeds defaults on install.

<hr/>

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Make your changes
3. Submit a pull request

<!-- Please make sure your code follows the [contributing guidelines](CONTRIBUTING.md) before submitting your pull request. -->
<hr/>

## License

This project is licensed under the [MIT License](LICENSE).
<hr/>

## Feature requests & Feedback

I'm always looking for ways the extension and make it more useful. If you have an idea for a new feature or notice a bug, please don't hesitate to let me know! You can visit the [issues page](https://github.com/djm30/distraction-free-reddit/issues) in the repository and create a new issue with the "feature request" or "bug" label.

Additionally, I'm always open to feedback on how the extension is working for you and how it can be improved. If you have any suggestions or just want to say hi, feel free to create a new issue with the "feedback" label!

Thanks for using Distraction Free Reddit and for helping me make it better!

<hr/>

## Screenshots

<p align="center">
  <img src="https://i.imgur.com/DWQGjrm.png" alt="The extension popup" width="300px"/>
</p>
<p align="center">The extension popup</p>

<br/>

<p align="center">
  <img src="https://i.imgur.com/acjpoJW.png" alt="The general settings screen" width="600px"/>
</p>
<p align="center">The general settings that can be configured</p>

<br/>

<p align="center">
  <img src="https://i.imgur.com/mDPTKYy.png" alt="The whitelist screen" width="600px"/>
</p>
<p align="center">The whitelist screen</p>

<br/>

<p align="center">
  <img src="https://i.imgur.com/klWHVPX.png" alt="Example of the blocking taking place" width="600px"/>
</p>
<p align="center">Example of the blocking taking place</p>