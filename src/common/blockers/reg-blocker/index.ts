import { parseUrl } from "../../util/url-parser";
import { BlockerSettings } from "../../settings-config";
import { Blocker } from "../../types";

const block = (url: string, settings: BlockerSettings) => {};
const onload = (url: string, settings: BlockerSettings) => {};

const RegBlocker: Blocker = {
  block,
  onload,
};

export default RegBlocker;
