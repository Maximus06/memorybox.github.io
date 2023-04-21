import { AJAX, API_URL } from "./api.js";
import { Store } from "./store.js";

// TODO
// - Charger les sauvegardes files
// - créer dynamiquement la liste des saves
// - listener sur l'image de save
// - chargement des data -> mise à jour du local storage.

// // Test
// fetch('http://192.168.0.30:2814/backup-files')
// .then(res => {
//   console.log('fetch test :>> ', res);
//   console.log('fetch response.ok :>> ', res.ok);
//   console.log('fetch response.status :>> ', res.status);
//   return res.json();
// })
// .then(data => console.log('res.json :>> ', data));


async function getBackupFile() {
  try {
    const data = await AJAX(`${API_URL}backup-files`);
    console.log("files :>> ", data);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }  
}

async function loadData(ev) {
  ev.preventDefault();
  const fileName = ev.target.dataset.name;
  try {
    const data = await AJAX(`${API_URL}backups/${fileName}`);
    // console.log("files :>> ", data.cards);
    Store.saveCards(data.cards)
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
  
}

getBackupFile();

const backupElements = document.querySelectorAll('.js-backup')
console.log('backupElements :>> ', backupElements);

backupElements.forEach(element => {
  console.log('element :>> ', element);
  element.addEventListener('click', ev => {
    loadData(ev);
  });
})
