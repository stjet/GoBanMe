//handle messages sent by web pages
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "address") {
    //request action
    //can the popup window send a response? maybe storage and waiting for window to close
    browser.windows.create({
      url: "background/connect/connect.html?url="+message.url+"&tab_id="+sender.tab.id,
      focused: true,
      type: "popup",
      width: 350,
      height: 500,
      top: (window.screen.height-500)/2,
      left:(window.screen.width-350)/2,
      allowScriptsToClose: true
    });
  } else if (message.action === "transaction") {
    //request send/change/receive
    let url;
    if (message.type === "send") {
      if (!Number(message.amount)) {
        sendResponse();
        return;
      }
      url = "background/transaction/transaction.html?to_address="+message.to_address+"&amount="+message.amount+"&type=send&url="+message.url;
    } else if (message.type === "change") {
      url = "background/transaction/transaction.html?to_address="+message.to_address+"&type=change&url="+message.url;
    }
    browser.windows.create({
      url: url,
      focused: true,
      type: "popup",
      width: 350,
      height: 500,
      top: (window.screen.height-500)/2,
      left:(window.screen.width-350)/2,
      allowScriptsToClose: true
    });
  }
  sendResponse();
});
