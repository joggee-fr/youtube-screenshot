// This file is supposed to import all needed external libraries
// and add it to window global variable.
// It is intended to be "built" using a bundler e.g. esbuild
// and the result file added to the add-on manifest.json.

import sanitize from "sanitize-filename";

window.YouTubeScreenshotAddonVendor = {
    sanitize: sanitize,
};
