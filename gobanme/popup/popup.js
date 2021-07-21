browser.bananocoinBananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');
browser.storage.local.get('seed').then((item) => {
  if (JSON.stringify(item) != '{}') {
    document.getElementById("seed-enter").style.display = "none";
    document.getElementById("site-info").style.display = "block";
  }
});
let content;
document.getElementById("log-out-1").onclick = log_out;
document.getElementById("log-out-2").onclick = log_out;
document.getElementById("go-button").onclick = go;
document.getElementById("send-button").onclick = pay;
document.getElementById("pay").onchange = display_amount;
browser.tabs.query({active: true}).then((tabs_array) => {
  let url = tabs_array[0].url;
  let https = false;
  if (tabs_array[0].url.startsWith("http://")) {
    url = url.replace("http://","");
  } else if (tabs_array[0].url.startsWith("https://")) {
    url = url.replace("https://","");
    https = true;
  }
  url = url.split('/')[0];
  if (https) {
    url = "https://"+url+"/banano.json";
  } else {
    url = "http://"+url+"/banano.json";
  }
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        content = JSON.parse(this.responseText);
        document.getElementById("address").innerText = content['address'];
        document.getElementById("description").innerText = content['description'];
        document.getElementById("suggested-donation").innerText = content['suggested_donation'];
        document.getElementById("author").innerText = content['author'];
        document.getElementById("pay").value = content['suggested_donation'];
        document.getElementById("send-button").value = "Send "+content['suggested_donation']+" Bananos";
      } else {
        document.getElementById("error-content").style.display = "block";
        document.getElementById("site-info").style.display = "none";
      }
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
});
function display_amount() {
  document.getElementById('send-button').value = "Send "+String(document.getElementById("pay").value)+" Bananos";
}
function go() {
  document.getElementById("seed-enter").style.display = "none";
  if (content) {
    document.getElementById("site-info").style.display = "block";
  } else {
    document.getElementById("error-content").style.display = "block";
  }
  browser.storage.local.set({'seed':document.getElementById("seed").value});
}
async function send_banano(address, value) {
  let seed = await browser.storage.local.get('seed');
  document.getElementById("debug").innerHTML = JSON.stringify(seed)
  await browser.bananocoinBananojs.sendBananoWithdrawalFromSeed(seed.seed, 0, address, value) 
}
function pay() {
  send_banano(document.getElementById("address").innerText, Number(document.getElementById("pay").value));
}
async function log_out() {
  await browser.storage.local.remove('seed');
  document.getElementById("seed-enter").style.display = "block";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("error-content").style.display = "none";
}