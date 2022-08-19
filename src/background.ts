import { initialiseSettings, getSettings, pushBlacklist, resetSettings } from "./chrome/storage"


initialiseSettings().then(() => console.log("Updated settings"));






export { }