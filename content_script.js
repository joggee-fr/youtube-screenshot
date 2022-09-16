var loggingEnabled = false;
var initCalled = false;

// Take screenshot
captureScreenshot = function () {
  logger("Capturing screenshot");
  var canvas = document.createElement("canvas");
  var video = document.querySelector("video");
  var ctx = canvas.getContext("2d");
  canvas.width = parseInt(video.style.width);
  canvas.height = parseInt(video.style.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  downloadFile(canvas);
};

downloadFile = function (canvas) {
  var aClass = "youtube-screenshot-a";
  var a = document.createElement("a");
  a.href = canvas.toDataURL("image/jpeg");
  a.download = getFileName();
  a.style.display = "none";
  a.classList.add(aClass);
  document.body.appendChild(a);
  document.querySelector(`.${aClass}`).click();
  document.body.removeChild(a);
};

getFileName = function () {
  seconds = document.getElementsByClassName("video-stream")[0].currentTime;
  mins = seconds / 60;
  secs = seconds % 60;
  m = mins.toString();
  s = secs.toString();
  mm = m.substring(0, m.indexOf("."));
  ss = s.substring(0, s.indexOf("."));
  if (ss.length == 1) {
    ss = "0" + ss;
  }
  return `${window.document.title} - ${mm}:${ss}.jpeg`;
};

addButtonOnYoutubePlayer = function (controlsDiv) {
  logger("Adding screenshot button");
  let btn = document.createElement("button");
  let t = document.createTextNode("Screenshot");
  btn.classList.add("ytp-time-display");
  btn.classList.add("ytp-button");
  btn.classList.add("ytp-screenshot");
  btn.style.width = "auto";
  btn.appendChild(t);
  controlsDiv.insertBefore(btn, controlsDiv.firstChild);
};

addEventListener = function () {
  logger("Adding button event listener");
  var youtubeScreenshotButton = document.querySelector(".ytp-screenshot");
  youtubeScreenshotButton.removeEventListener("click", captureScreenshot);
  youtubeScreenshotButton.addEventListener("click", captureScreenshot);
};

function waitForYoutubeControls(callback) {
  const controlsClass = "ytp-right-controls";

  const controlsDiv = document.querySelector(`.${controlsClass}`);
  if (controlsDiv) {
    callback(controlsDiv);
    return;
  }

  // Controls are not yet ready, wait for them
  logger("Wait for Youtube controls");

  let observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (!mutation.addedNodes)
        return;

      for (let element of mutation.addedNodes) {
        if (element.classList.contains(controlsClass)) {
          observer.disconnect();
          logger("Found Youtube controls");
          callback(element);
        }
      }
    })
  })

  observer.observe(document.body, { childList: true, subtree: true });
}

logger = function (message) {
  if (loggingEnabled) {
    console.log(`Youtube Screenshot Addon: ${message}`);
  }
};

// Initialization
console.log("Initializing Youtube Screenshot Addon");

var storageItem = browser.storage.local.get();
storageItem.then((result) => {
  if (result.YouTubeScreenshotAddonisDebugModeOn) {
    logger("Addon initializing!");
    loggingEnabled = true;
  }

  waitForYoutubeControls(controlsDiv => {
    addButtonOnYoutubePlayer(controlsDiv);
    addEventListener();
  });
});
