// export let API_URL = "https://omk.freeboxos.fr:2814/";
export let API_URL;
export let SERVER;
const TIMEOUT_SEC = 3;

const domain = "https://omk.freeboxos.fr"
// const domain = "http://127.0.0.1"


// the differents server available inside omk.freeboxos.fr domain (each server is map to a port)
const server_urls = [`${domain}:2814/`, `${domain}:2815/`, `${domain}:2816/` ];

if (API_URL === undefined){
  SERVER = await get_server();
  API_URL = SERVER.url;
}

const serverSpan = document.querySelector('#server')
if (SERVER != undefined) {  
  serverSpan.textContent = "Serveur " + SERVER.name + " up 🚀";
}

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // mode: "no-cors",
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    console.log("response dans AJAX :>> ", res);
    const data = await res.json();

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    if (!res.ok) throw new Error(`${data.message}`);

    return data;
  } catch (err) {
    // Un time out du serveur (déclenché ici par la fonction timeout) va déclencher une exception
    console.log("DEBUG: erreur dans le catch = ", err)
    throw err;
  }
};

export async function save(name="") {
  let data;
  let payload;

  try {
    // get the data from local storage   
    data = JSON.parse(localStorage.getItem("cards"));
 
    payload = {
      cards: data,
      name: name
    };

  } catch (err) {
    console.log('err :>> ', err);
    Swal.fire({
      title: 'Oups un problème est survenu',
      err,
      icon: 'info'
    });
    return;
  }

  // stringify the data
  let jsonData = JSON.stringify(payload);

  const response = await fetch(`${API_URL}backups`, {
    method: "POST",
    body: jsonData,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // charset: "utf-8",
    },
    // mode: "no-cors",
    // redirect: "follow",
  });
  console.log("response :>> ", response);

  let message = await response.json();
  console.log("response.ok :>> ", response.ok);
  console.log("response.status :>> ", response.status);
  console.log("response.json :>> ", message);

  if (!response.ok) {
    message = "une erreur est survenue lors de la sauvegarde des data";
  } else {
  }
  return message;
}

export function createCard() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const card = { title: "test" };
  // const cards = [
  //   {title: "Pokémon 1"},
  //   {title: "Pokémon 2"}
  // ]

  var raw = JSON.stringify(card);

  // var raw = JSON.stringify({
  //   title: "Pokemon legendéraire"
  // });
  console.log("raw :>> ", raw);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    accept: "*/*",
    // body: raw,
    body: JSON.stringify({ title: "Pokemon legendary" }),
    redirect: "follow",
    mode: "no-cors",
  };

  fetch("http://192.168.0.30:2814/cards", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log("result = ", result))
    .catch((error) => console.log("error", error));
}

export async function get_save_name() {
  console.log("dans get save name :>> ");
  const { value: name } = await Swal.fire({
    title: "Enter your backup name",
    input: "text",
    inputLabel: "Backup Name",
    inputValue: "Nom de la sauvegarde",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });
  console.log("backup name :>> ", name);
  // return value;
}

export async function load() {
  backupName = await get_save_name();
  console.log("backupName :>> ", backupName);
}

/**
 * Return the first url server available
 */
export async function get_server() {
    // const response = await AJAX(server_urls[0] + "server")
    // console.log("server name", response)

    let urlsToFetch = [];
    server_urls.forEach(url => {
      urlsToFetch.push(fetch(url + "server"))     
    });
    // add a promise for managing the timeout
    // urlsToFetch.push(timeout(TIMEOUT_SEC))

    const res = await Promise.any(urlsToFetch);
    const server = await res.json();

    // API_URL = server.url
    return server

    // TODO: gérer les erreurs,    
    // Documenter les certificats ssl.
}
