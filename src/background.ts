import storageFunctions from "./common/storage-service";
import logger from "./common/util/logger";

// Settings changes propagate to content scripts via storage.onChanged, so the
// background script's only job is seeding default settings on first install.
storageFunctions
  .initializeSettings()
  .then(() => logger.info("Settings initialised"))
  .catch((error) => logger.error(error));
