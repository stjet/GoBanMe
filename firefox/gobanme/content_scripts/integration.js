(function() {
  if (window.hasRun) {
    return false;
  }
  window.hasRun = true;
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "youtube") {
      //get banano addresses if in youtube /about description
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
    } else if (message.command === "youtube2") {
      //add a "Enqueue on JTV" button
      //gets video name, removing the " - Youtube"
      let video_name = document.title.slice(0, -10);
      //change the title
      let title_ele = document.querySelector(".title.style-scope.ytd-video-primary-info-renderer");
      title_ele.innerText = video_name+" ";
      let link = document.createElement("a");
      link.href = "https://jungletv.live/enqueue?url="+window.location.href;
      link.target = "_blank";
      link.innerText = "(Enqueue on JTV)";
      title_ele.appendChild(link); 
      //dis probably not needed but im leaving it in
      sendResponse("Success");
    }
  });
  return true;
})();
