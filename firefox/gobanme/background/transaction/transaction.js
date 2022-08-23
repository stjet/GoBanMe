browser.bananocoinBananojs.setBananodeApiUrl('https://kaliumapi.appditto.com/api');

let params = new URLSearchParams(window.location.search);
let to_address = params.get("to_address");
let amount = Number(params.get("amount"));
let type = params.get("type");
let r_url = params.get("url");

//0 or NaN
if (!amount && type === "send") {
  //close popup
  window.close();
}

if (!browser.bananocoinBananojs.getBananoAccountValidationInfo(to_address).valid && (type === "send" || type === "change")) {
  window.close();
}

document.getElementById("refuse").onclick = function() {
  window.close();
};

//now populate the fields with to address and amount, and ask user to approve/decline
//nothing needs to be sent back to background script or website, so should be simple
//the website should see if they received the transaction themselves, it is insecure to rely on the extension anyways
document.getElementById("req-site").innerText = r_url;

//seed stuff
function uint8_to_string(uint8){
  return new TextDecoder("utf-8").decode(uint8);
}
function string_to_uint8(string) {
  return new TextEncoder("utf-8").encode(string);
}

async function get_seed() {
  let password = document.getElementById("password").value;
  document.getElementById("password").value = "";
  let key = browser.nacl.hash(string_to_uint8(password)).slice(32);
  let nonce = await browser.storage.local.get("nonce");
  let encrypted = await browser.storage.local.get("encrypted");
  return uint8_to_string(browser.nacl.secretbox.open(encrypted.encrypted, nonce.nonce, key));
}

//sending function
if (type === "send") {
  document.getElementById("send-h").style.display = "block";
  document.getElementById("to-address-text").style.display = "block";
  document.getElementById("amount-text").style.display = "block";
  document.getElementById("to-address").innerText = to_address.slice(0,9)+"..."+to_address.slice(-7);
  document.getElementById("amount").innerText = String(amount);
  document.getElementById("accept").onclick = async function() {
    let seed;
    try {
      seed = await get_seed();
    } catch (e) {
      document.getElementById("error-msg").innerText = "Wrong password";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3000);
      return;
    }
    if (!seed) {
      document.getElementById("error-msg").innerText = "Invalid seed probably";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3000);
      return;
    }
    if (!browser.bananocoinBananojs.bananoUtil.isSeedValid(seed).valid) {
      document.getElementById("error-msg").innerText = "Invalid seed or wrong password";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3000);
      return;
    }
    browser.bananocoinBananojs.sendBananoWithdrawalFromSeed(seed, 0, to_address, amount).then(() => {
      window.close();
    }).catch((e) => {
      document.getElementById("error-msg").innerText = "Error during send";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3500);
      return;
    });
  };
} else if (type === "change") {
  document.getElementById("change-h").style.display = "block";
  document.getElementById("to-address-text").style.display = "block";
  document.getElementById("to-address").innerText = to_address.slice(0,9)+"..."+to_address.slice(-7);
  document.getElementById("accept").onclick = async function() {
    let seed;
    try {
      seed = await get_seed();
    } catch (e) {
      document.getElementById("error-msg").innerText = "Wrong password";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3000);
      return;
    }
    if (!seed) {
      document.getElementById("error-msg").innerText = "Invalid seed probably";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3000);
      return;
    }
    browser.bananocoinBananojs.changeBananoRepresentativeForSeed(seed, 0, to_address).then(() => {
      window.close();
    }).catch((e) => {
      document.getElementById("error-msg").innerText = "Error during send";
      setTimeout(function() {
        document.getElementById("error-msg").innerText = "";
      }, 3500);
      return;
    });
  };
}
