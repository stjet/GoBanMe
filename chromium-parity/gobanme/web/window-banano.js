//injects a window.banano to interact with gobanme
function request_payment(to_address, amount) {
  window.postMessage({
    to_address: to_address,
    amount: amount,
    action: "transaction",
    type: "send",
    url: window.location.hostname
  }, "*");
}

function request_rep_change(to_address) {
  window.postMessage({
    to_address: to_address,
    action: "transaction",
    type: "change",
    url: window.location.hostname
  }, "*");
}

function request_address() {
  window.postMessage({
    action: "address",
    url: window.location.hostname
  }, "*");
}

window.banano = {
  request_payment: request_payment,
  request_rep_change: request_rep_change,
  request_address: request_address
}
