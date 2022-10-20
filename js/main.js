import { App } from "./app.js";
import { UI } from "./UI.js";

main();

function main() {
  if (document.querySelector("#card-container") === null) {
    console.log("on stop le chargement de app.js");
    return;
  }

  // Event: dom loaded
  document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });

  // Event: click on one of the icon in the header of the card
  document.querySelector("#card-container").addEventListener("click", (e) => {
    // click on the eye to see  the solution
    if (e.target.classList.contains("fa-eye")) {
      const visibleCard = e.target.parentElement.parentElement.parentElement;
      const hiddenCard = visibleCard.nextElementSibling;
      hiddenCard.classList.toggle("d-none");
    }

    // click on the thumb up (card memorized)
    if (e.target.classList.contains("fa-thumbs-up")) {
      let id = Number(e.target.dataset.id);
      App.consolidateCard(true, id);
    }

    // click on the thumbs down (card not memorized)
    if (e.target.classList.contains("fa-thumbs-down")) {
      console.log("pouce rouge");
      let id = Number(e.target.dataset.id);
      App.consolidateCard(false, id);
    }
  });

  // Event : filter on click on different step
  document.querySelector("#step-container").addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
      // desactive the last step btn
      let btnStep = document.getElementById("btn-step-" + App.step);
      btnStep.classList.remove("active");
      // active the btn
      e.target.classList.add("active");

      // save the last step btn click
      App.step = Number(e.target.dataset.num);

      // const filterCards = App.cards.filter(card => card.step == App.step);
      App.refreshCardsList();
    }
  });

  // Event: change selected set
  document.getElementById("select-set").addEventListener("change", (e) => {
    let setSelected = "";
    // case 'label' option Selectionnez ... nothing to do
    if (e.target.options[e.target.value] === undefined) {
      return;
    }

    if (e.target.value === "0") {
      setSelected = "*";
    } else {
      setSelected = e.target.options[e.target.value].text;
    }

    App.step = 1;
    App.set = setSelected;

    App.refreshCardsList();

    UI.calcCardNumberByStep();
  });

  // Event: change selected theme
  document.getElementById("select-theme").addEventListener("change", (e) => {
    let themeSelected = "";
    // case 'label' option Selectionnez ... nothing to do
    // if (e.target.options[e.target.value] === undefined) {
    //    return;
    // }

    if (e.target.value === "0") {
      themeSelected = "*";
    } else {
      themeSelected = e.target.options[e.target.value].text;
    }

    App.step = 1;
    App.theme = themeSelected;

    App.refreshCardsList();
    UI.calcCardNumberByStep();
    UI.fillSetList(themeSelected);
  });

  // Event: Add a Book
  // document.querySelector('#book-form').addEventListener('submit', (e) => {
  //    // Prevent actual submit
  //    e.preventDefault();

  //    // Get form values
  //    const id = document.querySelector('#id').value;
  //    const recto = document.querySelector('#recto').value;
  //    const verso = document.querySelector('#verso').value;

  //    // Validate
  //    if (id === '' || recto === '' || verso === '') {
  //       UI.showAlert('Please fill in all fields', 'danger');
  //    } else {
  //       // Instatiate book
  //       const book = new Book(id, recto, verso);

  //       // Add Book to UI
  //       UI.addBookToList(book);

  //       // Add book to store
  //       Store.addBook(book);

  //       // Show success message
  //       UI.showAlert('Book Added', 'success');

  //       // Clear fields
  //       UI.clearFields();
  //    }
  // });

  // Event: Remove a Book
  // document.querySelector('#book-list').addEventListener('click', (e) => {
  //    // Remove book from UI
  //    UI.deleteBook(e.target);

  //    // Remove book from store
  //    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //    // Show success message
  //    UI.showAlert('Book Removed', 'success');
  // });
}
