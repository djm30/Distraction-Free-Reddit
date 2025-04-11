# Distraction Free Reddit

Distraction Free Reddit is a Chrome extension designed to help users to engage with Reddit more intentionally. With this extension, users can block off parts of the site that they find most distracting, allowing them to cut out mindless scrolling and focus on the content that matters to them.

Note: This currently only works with the reddit redesign and does not yet support old reddit.
<hr/>

## Installation

To install the extension, follow these steps:
1. Go to the Chrome Web Store and search for "Distraction Free Reddit"
2. Click the "Add to Chrome" button
3. Click "Add Extension" to confirm the installation


### Building locally
To build locally, first ensure you have both rust and node/npm installed.

1. First build the build tool by running `cd build_tool && cargo build --release` (Note if you are on windows, you may need to change the `chrome` and `firefox` scripts in the package.json to use `./build_tool.exe` instead of just `./build_tool`)
2. Run `npm run chrome` `npm run firefox` or `npm run both` to build the extension. This will build the extension to a `build_[BROWSER_NAME]` folder at the top level
3. Add the unpacked extension to your browser, this usually requires developer mode to be enabled.

<hr/>

## Usage

1. Install the extension in your browser (see installation instructions).
2. Click on the extension icon in your browser toolbar to open the options menu.
3. Enable the extension
4. Click on the options button to open the settings
5. Choose the settings you want to apply to your Reddit browsing experience, including hiding the main feed, hiding certain subreddits, and enabling whitelist or blacklist modes.

Refresh your Reddit page to see the changes take effect.

<hr/>

## Features

Distraction Free Reddit allows you to customize your Reddit experience by hiding various parts of the site that can lead to mindless scrolling and distract you from your goals. Here are some of the features:

- Hide main feed: Hide the main feed of posts on the Reddit homepage, to help you avoid getting sucked into endless scrolling.
- Hide r/all and popular: Hide the r/all and popular feeds, which can be sources of distractions and time-wasting content.
- Hide user profiles: Hide the user profile pages, which can lead to comparing yourself to others and feeling like you're missing out.
- Hide full page search: Hide the search bar and full page search results, which can be a source of distractions.
- Hide sidebar: Hide the sidebar on subreddit pages, which can contain distracting or irrelevant information.
- Hide comments: Hide the comment sections on posts, which can be a source of time-wasting debates or irrelevant information.
- Whitelist mode: Enable a whitelist mode to only allow access to certain subreddits that you specify. This can help you focus on content that is relevant to your interests or goals.
- Blacklist mode: Enable a blacklist mode to block access to certain subreddits that you find distracting or unhelpful. This can help you avoid time-wasting content and stay focused on your goals.

These settings will hopefully allow you to use reddit in a more intentional way and encourage a healthier relationship with the site.
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