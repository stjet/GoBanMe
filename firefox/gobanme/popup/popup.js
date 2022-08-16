browser.bananocoinBananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');
let seed;
let already_discover = false;
document.getElementById("balance-too-low").style.display = "none";
document.getElementById("log-out-1").onclick = log_out;
document.getElementById("log-out-2").onclick = log_out;
document.getElementById("go-button1").onclick = go1;
document.getElementById("go-button2").onclick = go2;
document.getElementById("send-button").onclick = pay;
document.getElementById("pay").onchange = display_amount;
document.getElementById("tabs").style.display = "none";
document.getElementById("site-tab").onclick = switch_to_site_tab;
document.getElementById("discover-tab").onclick = switch_to_discover_tab;
document.getElementById("wallet-tab").onclick = switch_to_wallet_tab;
document.getElementById("wallet").style.display = "none";
document.getElementById("discover").style.display = "none";
document.getElementById("recieve-pending").onclick = recieve_pending;
document.getElementById("rep-btn").onclick = change_rep;
document.getElementById("password-enter").style.display = "none";
document.getElementById("new-seed-btn").onclick = enter_new_seed;
document.getElementById("types").onchange = discover_filter;
document.getElementById("man-send-btn").onclick = manual_send;
document.getElementById('close-reopen').style.display = "none";
document.getElementById("problem-during-send").style.display = "none";
browser.tabs.query({active: true, currentWindow: true}).then((tabs_array) => {
  if (tabs_array[0].url.startsWith("https://www.youtube.com/watch")) {
    browser.tabs.executeScript(tabs_array[0].id, {file: "/content_scripts/integration.js"}).catch((e) => {
      //document.getElementById('debug').innerText = e;
    });
    //check description
    browser.tabs.sendMessage(tabs_array[0].id, {command: "youtube2"});
  }
});
document.getElementById("password").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    go2();
  }
});
browser.storage.local.get("encrypted").then((e) => {
  if (Object.keys(e).length != 0) {
    document.getElementById("password-enter").style.display = "block";
    document.getElementById("seed-enter").style.display = "none";
  }
});
function get_info() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs_array) => {
    let url = tabs_array[0].url;
    //special integration for youtube
    if (url.startsWith("https://www.youtube.com") && url.endsWith("/about")) {
      document.getElementById('close-reopen').style.display = "block";
      browser.tabs.executeScript(tabs_array[0].id, {file: "/content_scripts/integration.js"}).catch((e) => {
        //document.getElementById('debug').innerText = e;
      });
      //check description
      browser.tabs.sendMessage(tabs_array[0].id, {command: "youtube"}).then((address) => {
        document.getElementById('close-reopen').style.display = "none";
        //document.getElementById('debug').innerText = address;
        if (!address) {
          document.getElementById("tabs").style.display = "none";
          document.getElementById("error-content").style.display = "block";
          document.getElementById("site-info").style.display = "none";
          document.getElementById("wallet").style.display = "none";
          document.getElementById("discover").style.display = "none";
          return
        }
        document.getElementById("tabs").style.display = "block";
        document.getElementById("error-content").style.display = "none";
        document.getElementById("site-info").style.display = "block";
        document.getElementById("site-tab").classList.add("selected-tab");
        document.getElementById("discover-tab").classList.add("unselected-tab");
        document.getElementById("wallet-tab").classList.add("unselected-tab");
        document.getElementById("wallet").style.display = "none";
        document.getElementById("discover").style.display = "none";
        document.getElementById("address").innerText = address.slice(0,9)+"..."+address.slice(-7);
        document.getElementById("true-address").innerText = address;
        document.getElementById("copy-address").onclick = copy_address;
        document.getElementById("description").innerText = "Youtube channel";
        document.getElementById("suggested-donation").innerText = "1";
        document.getElementById("author").innerText = "Youtube channel";
        document.getElementById("pay").style.display = 'block';
        document.getElementById("pay-1").style.display = 'none';
        document.getElementById("pay").value = 1;
        document.getElementById("send-button").value = "Send 1 Banano";
        return;
      });
      return;
    }
    let https = false;
    if (url.startsWith("http://")) {
      url = url.replace("http://","");
    } else if (url.startsWith("https://")) {
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
          //make sure it is valid json
          let content;
          try {
            content = JSON.parse(this.responseText);
            if (!content['address']) {
              document.getElementById("tabs").style.display = "none";
              document.getElementById("error-content").style.display = "block";
              document.getElementById("site-info").style.display = "none";
              document.getElementById("wallet").style.display = "none";
              document.getElementById("discover").style.display = "none";
            }
          } catch (e) {
            document.getElementById("tabs").style.display = "none";
            document.getElementById("error-content").style.display = "block";
            document.getElementById("site-info").style.display = "none";
            document.getElementById("wallet").style.display = "none";
            document.getElementById("discover").style.display = "none";
            return;
          }
          document.getElementById("tabs").style.display = "block";
          document.getElementById("error-content").style.display = "none";
          document.getElementById("site-info").style.display = "block";
          document.getElementById("site-tab").classList.add("selected-tab");
          document.getElementById("discover-tab").classList.add("unselected-tab");
          document.getElementById("wallet-tab").classList.add("unselected-tab");
          document.getElementById("wallet").style.display = "none";
          document.getElementById("discover").style.display = "none";
          document.getElementById("address").innerText = content['address'].slice(0,9)+"..."+content['address'].slice(-7);
          document.getElementById("true-address").innerText = content['address'];
          document.getElementById("copy-address").onclick = copy_address;
          document.getElementById("description").innerText = content['description'];
          document.getElementById("suggested-donation").innerText = content['suggested_donation'];
          document.getElementById("author").innerText = content['author'];
          //checks if suggested donation is float
          if (!isNaN(content['suggested_donation']) && content['suggested_donation'].toString().indexOf('.') != -1) {
            document.getElementById("pay").style.display = 'none';
            document.getElementById("pay-1").style.display = 'block';
            document.getElementById("pay-1").value = content['suggested_donation'];
          } else {
            document.getElementById("pay").style.display = 'block';
            document.getElementById("pay-1").style.display = 'none';
            document.getElementById("pay").value = content['suggested_donation'];
          }
          document.getElementById("send-button").value = "Send "+content['suggested_donation']+" Bananos";
        } else {
          document.getElementById("tabs").style.display = "none";
          document.getElementById("error-content").style.display = "block";
          document.getElementById("site-info").style.display = "none";
          document.getElementById("wallet").style.display = "none";
          document.getElementById("discover").style.display = "none";
        }
      }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
  });
}
function display_amount() {
  document.getElementById('send-button').value = "Send "+String(document.getElementById("pay").value)+" Bananos";
}
function copy_address() {
  navigator.clipboard.writeText(document.getElementById("true-address").innerText);
}
async function send_banano(address, value, manual=false) {
  //"manual" to false means being sent through site tipping screen. If true, its a wallet send to a different account
  if (!manual) {
    document.getElementById("balance-too-low").style.display = "none";
  } else {
    document.getElementById("problem-during-send").style.display = "none";
  }
  await browser.bananocoinBananojs.sendBananoWithdrawalFromSeed(seed, 0, address, value).catch(err => {
    if (!manual) {
      document.getElementById("balance-too-low").style.display = "block";
    } else {
      document.getElementById("problem-during-send").style.display = "block";
    }
  });
}
function pay() {
  if (document.getElementById("pay").style.display == "block") {
    send_banano(document.getElementById("true-address").innerText, Number(document.getElementById("pay").value));
    document.getElementById("send-button").value = "SENT";
    setTimeout(function(){
      document.getElementById("send-button").value = "Send";
    }, 2000);
  } else {
    send_banano(document.getElementById("true-address").innerText, Number(document.getElementById("pay-1").value));
    document.getElementById("send-button").value = "SENT";
    setTimeout(function(){
      document.getElementById("send-button").value = "Send";
    }, 2000);
  }
}
function manual_send() {
  let to = document.getElementById("man_send_to").value;
  let amount = document.getElementById("man_send_amount").value;
  send_banano(to, amount, manual=true).then(() => {
    document.getElementById("man-send-btn").value = "SENT";
    setTimeout(function(){
      document.getElementById("man-send-btn").value = "Send";
    }, 2000);
  });
}
async function log_out() {
  seed = undefined;
  await browser.storage.local.remove(["nonce","encrypted"]);
  document.getElementById("seed-enter").style.display = "block";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("wallet").style.display = "none";
  document.getElementById("discover").style.display = "none";
  document.getElementById("tabs").style.display = "none";
  document.getElementById("error-content").style.display = "none";
}
function switch_to_site_tab() {
  document.getElementById("site-tab").classList.add("selected-tab");
  document.getElementById("site-tab").classList.remove("unselected-tab")
  document.getElementById("discover-tab").classList.add("unselected-tab");
  document.getElementById("discover-tab").classList.remove("selected-tab")
  document.getElementById("wallet-tab").classList.remove("selected-tab");
  document.getElementById("wallet-tab").classList.add("unselected-tab");
  document.getElementById("wallet").style.display = "none";
  document.getElementById("site-info").style.display = "block";
  document.getElementById("discover").style.display = "none";
}
function switch_to_discover_tab() {
  document.getElementById("site-tab").classList.add("unselected-tab");
  document.getElementById("site-tab").classList.remove("selected-tab")
  document.getElementById("discover-tab").classList.add("selected-tab");
  document.getElementById("discover-tab").classList.remove("unselected-tab")
  document.getElementById("wallet-tab").classList.remove("selected-tab");
  document.getElementById("wallet-tab").classList.add("unselected-tab");
  document.getElementById("wallet").style.display = "none";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("discover").style.display = "block";
  if (!already_discover) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let content = JSON.parse(this.responseText);
        for (i=0; i < Object.keys(content).length; i++) {
          let type = Object.keys(content)[i];
          for (j=0; j < Object.keys(content[type]).length; j++) {
            let name = Object.keys(content[type])[j];
            let url = content[type][Object.keys(content[type])[j]]
            let a = document.createElement('A');
            a.innerText = name;
            a.href = url;
            let div = document.createElement('DIV');
            div.appendChild(a);
            div.id = name;
            div.appendChild(document.createElement('BR'));
            div.classList.add("discover-site-div");
            div.classList.add(type);
            document.getElementById("discover-websites-list").appendChild(div);
          }
        }
      }
    }
    xhttp.open("GET", "https://prussia.dev/api/gobanme.json?nocache="+new Date().getTime(), true);
    xhttp.send();
    already_discover = true;
  }
}
function switch_to_wallet_tab() {
  document.getElementById("site-tab").classList.add("unselected-tab");
  document.getElementById("site-tab").classList.remove("selected-tab")
  document.getElementById("discover-tab").classList.add("unselected-tab");
  document.getElementById("discover-tab").classList.remove("selected-tab")
  document.getElementById("wallet-tab").classList.remove("unselected-tab");
  document.getElementById("wallet-tab").classList.add("selected-tab");
  document.getElementById("wallet").style.display = "block";
  document.getElementById("site-info").style.display = "none";
  document.getElementById("discover").style.display = "none";
  browser.bananocoinBananojs.getBananoAccountFromSeed(seed, 0).then(async (current_address) => {
    document.getElementById("wallet-address").innerText = current_address;
    let raw = await browser.bananocoinBananojs.getAccountBalanceRaw(current_address)
    let parts = await browser.bananocoinBananojs.getBananoPartsFromRaw(raw);
    document.getElementById("balance").innerText = parts.banano;
  })
}
async function recieve_pending() {
  let rep = await browser.bananocoin.bananojs.bananodeApi.getAccountRepresentative(document.getElementById("wallet-address").innerText);
  await browser.bananocoinBananojs.receiveBananoDepositsForSeed(seed, 0, rep);
}
async function change_rep() {
  await browser.bananocoinBananojs.changeBananoRepresentativeForSeed(seed, 0, document.getElementById("rep").value);
}
function go1() {
  if (document.getElementById('i-agree').checked) {
    if (browser.bananocoinBananojs.bananoUtil.isSeedValid(document.getElementById("seed").value).valid) {
      store_seed();
      document.getElementById("seed-enter").style.display = "none";
      get_info();
    }
  }
}
function go2() {
  get_seed().then((s) => {
    if (browser.bananocoinBananojs.bananoUtil.isSeedValid(s).valid) {
      seed = s;
      document.getElementById("password-enter").style.display = "none";
      get_info();
    }
  });
}
function string_to_uint8(string) {
  return new TextEncoder("utf-8").encode(string);
}
function uint8_to_string(uint8){
  return new TextDecoder("utf-8").decode(uint8);
}
function store_seed() {
  seed = document.getElementById("seed").value;
  let password = document.getElementById("new-password").value;
  document.getElementById("new-password").value = "";
  let key = browser.nacl.hash(string_to_uint8(password)).slice(32);
  let nonce = browser.nacl.randomBytes(24);
  let encrypted = browser.nacl.secretbox(string_to_uint8(seed), nonce, key);
  browser.storage.local.set({ "nonce": nonce, "encrypted": encrypted });
}
async function get_seed() {
  let password = document.getElementById("password").value;
  document.getElementById("password").value = "";
  let key = browser.nacl.hash(string_to_uint8(password)).slice(32);
  let nonce = await browser.storage.local.get("nonce");
  let encrypted = await browser.storage.local.get("encrypted");
  return uint8_to_string(browser.nacl.secretbox.open(encrypted.encrypted, nonce.nonce, key));
}
function enter_new_seed() {
  document.getElementById("password-enter").style.display = "none";
  document.getElementById("seed-enter").style.display = "block";
  browser.storage.local.remove(["nonce","encrypted"]);
}
function discover_filter() {
  let divs = document.getElementsByClassName("discover-site-div");
  if (document.getElementById("types").value == "all") {
    for (i=0; i < divs.length; i++) {
      divs[i].style.display = "block";
    }
  } else {
    for (i=0; i < divs.length; i++) {
      divs[i].style.display = "none";
    }
    let type_div = document.getElementsByClassName(document.getElementById("types").value);
    for (i=0; i < type_div.length; i++) {
      type_div[i].style.display = "block";
    }
  }
}