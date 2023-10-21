import { AJAX, API_URL, get_server } from "./api.js";
import { Store } from "./store.js";

console.log("api_url = ", API_URL)
// TODO
// Voir le badge nombre de carte ?
// Ajout message si server out
// Refactorer save and restore
// Ajout message d'info si doublon.

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
  let data;
  try {
    data = await AJAX(`${API_URL}backup-files`);
    // console.log("files dans getBackupFile :>> ", data);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
  return data.files;
}

function confirmRestore(ev) {
  let cancel = false;

  Swal.fire({
    title: 'Do you want to restore the backup?',
    text: "Warning, this will replace your actual data!!!",
    // icon: 'warning',
    icon: 'question',
    iconColor: 'red',
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: 'Restore',
    denyButtonText: `Don't save`,
  }).then((result) => {
    if (result.isConfirmed) {
      loadData(ev);
    }
    /* Read more about isConfirmed, isDenied below */
    // if (result.isConfirmed) {
    //   Swal.fire('Saved!', '', 'success')
    // } else if (result.isDenied) {
    //   Swal.fire('Changes are not saved', '', 'info')
    // }
  });
}

async function loadData(ev) {
  ev.preventDefault();

  const fileName = ev.target.dataset.name;
  let data;
  try {
    data = await AJAX(`${API_URL}backups/${fileName}`);
    // console.log("files :>> ", data.cards);
    Store.saveCards(data.cards)
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
  Swal.fire(
    "Data restore succesfully",
    `${data.cards.length} cards restored. ` + 'Merci qui ?',
    'success'
  )
}

// Create a li element and add it to the ul element
function addFileToList(file, parent) {
  
  const liElem = document.createElement('li');
  liElem.className = "list-group-item d-flex justify-content-center align-items-center"
  liElem.innerText = file

  const aElem = document.createElement('a');
  aElem.className = "nav-link js-load"
  aElem.setAttribute('href', "#");

  const iElem = document.createElement('i');
  iElem.className = "fas fa-download fa-lg js-backup";
  iElem.dataset.name = file;

  aElem.appendChild(iElem);

  // const spanElem = document.createElement("span")
  // spanElem.className = "badge bg-primary rounded-pill"
  // spanElem.textContent = "899"

  liElem.appendChild(aElem);

  // liElem.appendChild(spanElem);

  parent.appendChild(liElem);
}

// Update the dom with backup files downloaded
function displayBackup(files) {
  const ulElem = document.getElementById('save-list');

  // add each file to the backup files list (ul element)
  files.forEach(file => {
    addFileToList(file, ulElem);
  })
}

// Get all the backup files from the server
const saveFiles = await getBackupFile();

// build the list of backup files
displayBackup(saveFiles)

const backupElements = document.querySelectorAll('.js-backup')

// add the listener on each backup file
backupElements.forEach(element => {
  element.addEventListener('click', ev => {
    confirmRestore(ev);
  });
})
