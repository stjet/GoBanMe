//get banano addresses for selected sites
(function() {
  if (window.hasRun) {
    return false;
  }
  window.hashRun = true;
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "youtube") {
      let desc = document.getElementById('description-container').innerText;
      let found_index = desc.indexOf("ban_");
      if (found_index === -1) {
        //return false message
        sendResponse(false);
        //sender.sendResponse({address: false});
      }
      //addresses are 64 characters long
      let address = desc.substring(found_index, found_index+64);
      //check validity of address
      //regex
      let addr_regex = new RegExp("^(?:ban)(?:_)(?:1|3)(?:[13456789abcdefghijkmnopqrstuwxyz]{59})$");
      if (addr_regex.test(address) || address.length != 64) {
        //return the address
        sendResponse(address);
        //sender.sendResponse({address: address});
      } else {
        //fail, not valid address, return false message
        sendResponse(false);
        //sender.sendResponse({address: false});
      }
    }
  });
  return true;
})();