let params = new URLSearchParams(window.location.search);
let r_url = params.get("url");
let tab_id = Number(params.get("tab_id"));

document.getElementById("req-site").innerText = r_url;

document.getElementById("refuse").onclick = function() {
  window.close();
};

//seed stuff
function uint8_to_string(uint8){
  return new TextDecoder("utf-8").decode(uint8);
}
function string_to_uint8(string) {
  return new TextEncoder("utf-8").encode(string);
}

function uint8_to_hex(uint8) {
  let hex_string = "";
  for (let i=0; i < uint8.length; i++) {
    let hex = uint8[i].toString(16);
    //if hex is one character long, that means it is 4 bits (1/2 byte)
    //so, pad it with 0, so that the hex string is 8 bits (1 byte)
    //this ensures the returned hex string is the same amount of bytes as the uint8 array provided
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hex_string += hex;
  }
  return hex_string.toUpperCase();
}

async function get_seed() {
  let password = document.getElementById("password").value;
  document.getElementById("password").value = "";
  let key = chrome.nacl.hash(string_to_uint8(password)).slice(32);
  let nonce = await chrome.storage.local.get("nonce");
  let encrypted = await chrome.storage.local.get("encrypted");
  return uint8_to_string(chrome.nacl.secretbox.open(Uint8Array.from(Object.values(JSON.parse(encrypted.encrypted))), Uint8Array.from(Object.values(JSON.parse(nonce.nonce))), key));
}

//approve and signature
document.getElementById("accept").onclick = async function() {
  let seed;
  try {
    seed = await get_seed();
  } catch (e) {
    console.error(e)
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
  //sign and send response (address, plaintext hashed message that was signed, then signature)
  let msg_og = "gobanme-"+String(new Date().getTime());
  let msg_hashed = uint8_to_hex(chrome.nacl.hash(string_to_uint8(msg_og)));
  let priv_key = chrome.bananocoinBananojs.getPrivateKey(seed, 0);
  //signed message, in hex form
  let signed_hex = chrome.bananocoinBananojs.signHash(priv_key, msg_hashed);
  let address = await chrome.bananocoinBananojs.getBananoAccountFromSeed(seed, 0);
  //send
  chrome.tabs.sendMessage(tab_id, {
    original_message: msg_og,
    hashed_message: msg_hashed,
    signed_message: signed_hex,
    address: address
  });
  setTimeout(window.close, 100);
};
