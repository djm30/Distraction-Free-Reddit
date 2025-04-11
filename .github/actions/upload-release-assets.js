const { Octokit } = require("@octokit/action");
const fs = require("fs");

const octokit = new Octokit();

const owner = process.env.github.repository_owner;
const repo = process.github.event.repository.name;
const releaseId = process.env.github.event.release.id;

const files = ["build_chrome.zip", "build_firefox.zip", "source-code.zip"];

for (const file of files) {
  const filePath = `./${file}`;
  const fileData = fs.readFileSync(filePath);
  octokit.rest.repos
    .uploadReleaseAsset({
      owner,
      repo,
      release_id: releaseId,
      name: file,
      data: fileData,
      headers: {
        "content-type": "application/zip",
        "content-length": fileData.length,
      },
    })
    .then(() => {
      console.log(`Uploaded ${file} successfully.`);
    })
    .catch((err) => {
      console.error(`Failed to upload ${file}:`, err);
    });
}
