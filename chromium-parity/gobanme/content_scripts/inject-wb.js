//inject web/window-banano.js as a script tag
//with help from https://stackoverflow.com/questions/35915150/hook-window-property-in-custom-chrome-extension#35916042
let script = document.createElement("script");
script.src = chrome.runtime.getURL("web/window-banano.js");
script.onload = function() {
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(script);

window.addEventListener("message", function(event) {
  //pass on to background script
  chrome.runtime.sendMessage(event.data);
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  //receive responses from a successful "link" (site requests address, and signature, and the user approves)
  window.postMessage({
    type: "banano_link",
    content: message
  });
  sendResponse();
  return true;
});
