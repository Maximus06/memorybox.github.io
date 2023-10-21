import { save } from "./api.js";


// Send the cards (from local storage) to the backcup server
document.getElementById("backup-server").addEventListener("click", (e) => {
    
    const nameInput = document.getElementById('save-name')
    const result = save(nameInput.value).then((result)  => {
    // console.log("save :>> ", result);
    if (result) {
        Swal.fire(
            result.message,
            `File: ${result.file}. ` + 'Merci qui ?',
            'success'
        )
    }
    });
  });

