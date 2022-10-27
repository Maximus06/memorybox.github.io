import { Store } from "./store.js";
import { Card } from "./card.js";

class Fiche {
  constructor() {
    this.cards = [];
  }

  static initFiche() {
    //  If cards is not defined get the cards from the local storage
    if (!this.cards || this.cards.length == 0) {
      this.cards = Store.getCards();
    }

    // sort desc
    // this.cards.sort((a, b) => a.id - b.id);

    this.list = document.getElementById("card-list");
    this.list.innerHTML = "";
    this.nextId = 0;
    this.filterApplied = false;

    // display cards list
    this.cards.forEach((card) => this.addCardToList(card));
  }

  // Display a card in the list
  static addCardToList(card) {
    // memorize the more great id
    if (card.id > this.nextId) {
      this.nextId = card.id;
    }

    const row = document.createElement("tr");

    row.innerHTML = `
       <td>${card.theme}</td>
       <td>${card.set}</td>
       <td>${card.question}</td>
       <td>${card.answer}</td>
       <td>${card.step}</td>
       <td>${card.active}</td>       
       <td>
            <a href="#" class="btn btn-primary btn-sm">
            <i class="fas fa-trash-alt fa-lg delete" title="Suppression"></i>
            </a>
       </td>
       <td class="d-none">${card.id}</td>
       <td>
           <a href="#" class="btn btn-danger btn-sm ">
               <i class="fas fa-edit fa-lg edit" title="Mise à jour"></i>
           </a>
       </td>
     `;

    // this.list.appendChild(row);
    let theFirstChild = this.list.firstChild;
    this.list.insertBefore(row, theFirstChild);
  }

  static clearFields() {
    // document.querySelector('#theme').value = "";
    document.querySelector("#id").value = "";
    document.querySelector("#question").value = "";
    document.querySelector("#questionComplement").value = "";
    document.querySelector("#answer").value = "";
    document.querySelector("#answerComplement").value = "";
    document.querySelector("#step").value = 1;
    // document.querySelector('#set').value = "";
    document.querySelector("#chkActive").checked = true;
    document.querySelector("#sens").value = 1;
  }

  static deleteCard(el) {
    // get the id from the interface
    let id = Number(
      el.parentElement.parentElement.nextElementSibling.innerHTML
    );
    console.log("id :", id);
    // delete the card from the array in memory
    this.cards.forEach((card, index) => {
      console.log("id card : ", card.id);
      if (card.id == id) {
        console.log("id trouvé");
        this.cards.splice(index, 1);
      }
    });

    // update the local storage with the memory card array uddated
    localStorage.setItem("cards", JSON.stringify(this.cards));

    // delete card from list
    el.parentElement.parentElement.parentElement.remove();
  }

  static editCard(el) {
    // update the interface
    this.switchInterfaceMode();

    // get the id from the List interface
    let id = Number(
      el.parentElement.parentElement.previousElementSibling.innerHTML
    );

    // get the card objet from the array memory
    let card = Fiche.cards.find((card) => card.id == id);

    this.fielFields(card);

    document.getElementById("question").focus();
  }

  static fielFields(card) {
    document.querySelector("#id").value = card.id;
    document.querySelector("#theme").value = card.theme;
    document.querySelector("#question").value = card.question;
    document.querySelector("#questionComplement").value =
      card.complementQuestion;
    document.querySelector("#answer").value = card.answer;
    document.querySelector("#answerComplement").value = card.complementAnswer;
    document.querySelector("#step").value = card.step;
    document.querySelector("#chkActive").checked = card.active;
    document.querySelector("#sens").value = card.sens;
    document.querySelector("#set").value = card.set;
    document.querySelector("#select-color").value = card.color;
  }

  /**
   * switch between add mode and edit mode
   */
  static switchInterfaceMode() {
    document.getElementById("btn-add").classList.toggle("d-none");
    document.getElementById("btn-update").classList.toggle("d-none");
    document.getElementById("btn-cancel").classList.toggle("d-none");
  }

  /**
   * get the field value and create a card object for add or update card
   * @return {Card} card a object Card
   * @param {string} mode add or update mode (use to determine the id)
   */
  static getCardFromFieldValue(mode = "add") {
    let id = 0;
    if (mode === "add") {
      // get a new id in add mode else just get the existing value
      this.nextId++;
      id = this.nextId;
    } else {
      id = Number(document.getElementById("id").value);
    }

    const theme = document.getElementById("theme").value;
    const question = document.getElementById("question").value;
    const questionComplement =
      document.getElementById("questionComplement").value;
    const answer = document.getElementById("answer").value;
    const answerComplement = document.getElementById("answerComplement").value;
    const step = document.getElementById("step").value;
    const active = document.getElementById("chkActive").checked;
    const sens = document.getElementById("sens").value;
    const set = document.getElementById("set").value;
    const color = document.getElementById("select-color").value;

    return new Card(
      id,
      question,
      questionComplement,
      answer,
      answerComplement,
      sens,
      theme,
      step,
      set,
      color,
      active
    );
  }

  // valid the essential field of the card
  static isCardValid(card) {
    if (
      card.id === "" ||
      card.question === "" ||
      card.answer === "" ||
      card.theme === "" ||
      card.step === ""
    ) {
      return false;
    }

    return true;
  }
} // end class Fiche

Fiche.initFiche();

// Event: Add a card
document.getElementById("card-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  const card = Fiche.getCardFromFieldValue();

  // Validate
  if (
    card.id === "" ||
    card.question === "" ||
    card.answer === "" ||
    card.theme === ""
  ) {
    // UI.showAlert('Please fill in all fields', 'danger');
    console.log("Please fill in all fields", "danger");
    return;
  }

  Fiche.addCardToList(card);
  Fiche.cards.push(card);
  console.log("dans submit cards = : ", Fiche.cards);
  Fiche.cards.sort((a, b) => a.id - b.id);
  console.log("dans submit cards après invertion = : ", Fiche.cards);
  Store.saveCards(Fiche.cards);

  // Add Book to UI
  // UI.addBookToList(book);

  // Add book to store
  // Store.addBook(book);

  // Show success message
  // UI.showAlert('Book Added', 'success');

  // Clear fields
  Fiche.clearFields();
});

// Event: Click on the list Remove or Edit a Card
document.querySelector("#card-list").addEventListener("click", (e) => {
  // remove a card
  if (e.target.classList.contains("delete")) {
    Fiche.deleteCard(e.target);
  }

  // Edit a card
  if (e.target.classList.contains("edit")) {
    console.log("Edit the card");
    Fiche.editCard(e.target);
  }
});

// Event Update the card
document.getElementById("btn-update").addEventListener("click", (e) => {
  e.preventDefault();

  console.log("update the card");

  const cardUpdated = Fiche.getCardFromFieldValue("update");

  // Validate
  if (!Fiche.isCardValid(cardUpdated)) {
    console.log("Please fill in all fields", "danger");
    return;
  }

  // get the index of the card in the global array card
  let index = Fiche.cards.findIndex((card) => card.id === cardUpdated.id);
  console.log("index :", index);
  // months.splice(4, 1, 'May');

  console.log("ficheCards Avant splice :", Fiche.cards);
  Fiche.cards.splice(index, 1, cardUpdated);
  console.log("Fiche.cards[index] :", Fiche.cards[index]);
  console.log("ficheCards après splice :", Fiche.cards);

  Store.saveCards(Fiche.cards);

  Fiche.initFiche();
  // Fiche.addCardToList(card);

  // Show success message
  // UI.showAlert('Book Added', 'success');

  Fiche.clearFields();

  Fiche.switchInterfaceMode();
});

// Event: cancel the card edit
document.getElementById("btn-cancel").addEventListener("click", (e) => {
  e.preventDefault();

  Fiche.clearFields();
  Fiche.switchInterfaceMode();
});

// event: key press in the theme field
document.getElementById("filter-theme").addEventListener("keyup", (e) => {
  let stringToFind = e.target.value.toLowerCase();
  if (stringToFind == "" && Fiche.filterApplied) {
    Fiche.initFiche();
    return;
  }

  let filteredCards = Fiche.cards.filter((card) => {
    let result = card.theme.toLowerCase().indexOf(stringToFind);
    if (result >= 0) {
      return true;
    } else {
      return false;
    }
  });

  // del existing html
  document.querySelector("#card-list").innerHTML = "";
  // redisplay cards
  Fiche.nextId = 0;
  // display cards list
  filteredCards.forEach((card) => Fiche.addCardToList(card));
  // memorized a filter is applied
  Fiche.filterApplied = true;
});

// event: key press in the Set field
document.getElementById("filter-set").addEventListener("keyup", (e) => {
  let stringToFind = e.target.value.toLowerCase();
  if (stringToFind == "" && Fiche.filterApplied) {
    Fiche.initFiche();
    return;
  }

  let filteredCards = Fiche.cards.filter((card) => {
    let result = card.set.toLowerCase().indexOf(stringToFind);
    if (result >= 0) {
      return true;
    } else {
      return false;
    }
  });

  // del existing html
  document.querySelector("#card-list").innerHTML = "";
  // redisplay cards
  Fiche.nextId = 0;
  // display cards list
  filteredCards.forEach((card) => Fiche.addCardToList(card));
  // memorized a filter is applied
  Fiche.filterApplied = true;
});

// event: key press in the question field
document.getElementById("filter-question").addEventListener("keyup", (e) => {
  let stringToFind = e.target.value.toLowerCase();
  if (stringToFind == "" && Fiche.filterApplied) {
    Fiche.initFiche();
    return;
  }

  let filteredCards = Fiche.cards.filter((card) => {
    let result = card.question.toLowerCase().indexOf(stringToFind);
    if (result >= 0) {
      return true;
    } else {
      return false;
    }
  });

  // del existing html
  document.querySelector("#card-list").innerHTML = "";
  // redisplay cards
  Fiche.nextId = 0;
  // display cards list
  filteredCards.forEach((card) => Fiche.addCardToList(card));
  // memorized a filter is applied
  Fiche.filterApplied = true;
});

// Copy the cards (from local storage) in the clipboard
document.getElementById("backup").addEventListener("click", (e) => {
  navigator.clipboard.writeText(localStorage.getItem("cards"));
  e.target.innerHTML = "Backup (copié)";
});
