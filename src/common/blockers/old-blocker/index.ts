import { BlockerSettings } from "../../settings-config";
import { Blocker } from "../../types";

const block = (url: string, settings: BlockerSettings) => {};
const onload = (url: string, settings: BlockerSettings) => {};

const OldBlocker: Blocker = {
  block,
  onload,
};

export default OldBlocker;
