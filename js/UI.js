import { App } from "./app.js";

// UI Class: Handle UI Tasks
export class UI {
  static calcCardNumberByStep() {
    console.log("App.set :", App.set);

    let spanName = "";
    let span;
    let cardByStep = [];
    let filterCards = App.cards.filter((card) => card.set == App.set);

    // on applique un premier filtre si un theme ou une série ont été choisies ou non
    if (App.theme === "*" && App.set === "*") {
      // pas de série définie, on ne filtre pas le paquet de carte
      filterCards = App.cards;
    } else if (App.theme !== "*" && App.set === "*") {
      // cas un theme sans série
      filterCards = App.cards.filter((card) => card.theme == App.theme);
    } else if (App.theme === "*" && App.set !== "*") {
      // cas une série sans theme
      filterCards = App.cards.filter((card) => card.set == App.set);
    } else {
      // cas un théme et une série
      filterCards = App.cards.filter(
        (card) => card.theme == App.theme && card.set == App.set
      );
    }

    console.log("filterCards dans calcCardNumberByStep :", filterCards);

    // Cacul le nombre de carte par step pour remplir le "badge" (élément span)
    for (let i = 1; i <= 7; i++) {
      spanName = "span-" + i;

      cardByStep = filterCards.filter((card) => card.step == i);

      span = document.getElementById(spanName);
      span.innerHTML = cardByStep.length;
    }
  }

  // display the visible cards
  static displayCards(cards) {
    cards.forEach((card) => UI.displayCard(card));

    // load the other listener
    // App.addOtherListener();
  }

  static displayCard(card) {
    const cards = document.querySelector("#card-container");

    // the visible face
    const divRow = document.createElement("div");
    divRow.className = "row";

    let divCol = document.createElement("div");
    divCol.className = "col-6 mt-4";

    let divCard = document.createElement("div");
    // divCard.className = "card text-white border-dark bg-primary mb-3 ";
    console.log("color :>> ", card.color);
    divCard.className =
      "card text-white border-dark bg-primary mb-3 " + card.color;
    // divCard.style.backgroundColor = "green";

    let divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header border-dark";
    divCardHeader.textContent = card.theme;

    let icon = document.createElement("span");
    icon.className = "fas fa-eye fa-pull-right fa-border cursor-pointer ml-3";
    icon.title = "Voir la solution";
    divCardHeader.appendChild(icon);

    icon = document.createElement("span");
    icon.className =
      "fas fa-thumbs-down fa-pull-right fa-border cursor-pointer ml-3";
    icon.title = "A revoir";
    icon.dataset.id = card.id;
    divCardHeader.appendChild(icon);

    icon = document.createElement("span");
    icon.className = "fas fa-thumbs-up fa-pull-right fa-border cursor-pointer";
    icon.title = "Ok, j'ai mémorisé";
    icon.dataset.id = card.id;
    divCardHeader.appendChild(icon);

    divCard.appendChild(divCardHeader);

    let divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    let h4 = document.createElement("h4");
    h4.className = "card-title";
    let pComplement = document.createElement("p");
    pComplement.className = "cart-text";

    if (card.sens == 1) {
      h4.textContent = card.question;
      pComplement.textContent = card.complementQuestion;
    } else {
      h4.textContent = card.answer;
      pComplement.textContent = card.complementAnswer;
    }

    divCardBody.appendChild(h4);

    divCardBody.appendChild(pComplement);

    divCard.appendChild(divCardBody);
    divCol.appendChild(divCard);
    divRow.appendChild(divCol);

    // create the invisible face
    divCol = document.createElement("div");
    divCol.className = "col-6 mt-4 d-none";

    divCard = document.createElement("div");
    divCard.className = `card text-white border-dark bg-info mb-3 ${card.color}`;

    divCardHeader = document.createElement("div");
    divCardHeader.className = "card-header border-dark";
    divCardHeader.textContent = card.theme;

    divCard.appendChild(divCardHeader);

    divCardBody = document.createElement("div");
    divCardBody.className = "card-body";
    h4 = document.createElement("h4");
    h4.className = "card-title";
    pComplement = document.createElement("p");
    pComplement.className = "cart-text";

    if (card.sens == 1) {
      h4.textContent = card.answer;
      pComplement.textContent = card.complementAnswer;
    } else {
      h4.textContent = card.question;
      pComplement.textContent = card.complementQuestion;
    }

    divCardBody.appendChild(h4);
    divCardBody.appendChild(pComplement);

    divCard.appendChild(divCardBody);
    divCol.appendChild(divCard);
    divRow.appendChild(divCol);

    // add the row to the container
    cards.appendChild(divRow);
  }

  /**
   *  Fill the select list for the set with unique value for each existing set
   */
  static fillSetList(theme = "*") {
    // array of distinct set value
    let sets = [];
    let cards;

    // if a theme is defined filter the set on that theme
    if (theme != "*") {
      cards = App.cards.filter((card) => card.theme == theme);
    } else {
      cards = App.cards;
    }

    // parcours des cartes pour trouver les valeurs uniques de chaque série.
    cards.forEach((card) => {
      if (card.set == "") {
        card.set = "Série non renseignée";
      }

      let result = sets.find((set) => set == card.set);
      if (result === undefined) {
        sets.push(card.set);
      }
    });

    const select = document.getElementById("select-set");

    let rowHtml = '<option selected="" value="0">Toutes les séries</option>';
    let i = 1;
    sets.forEach((set) => {
      rowHtml += `<option value="${i}">${set}</option>`;
      i++;
    });

    select.innerHTML = rowHtml;
  }

  /**
   *  Fill the select list for the set with unique value for each existing set
   */
  static fillThemeList() {
    // array of distinct set value
    let themes = [];

    const cards = App.cards;

    // parcours des cartes pour trouver les valeurs uniques de chaque thème.
    cards.forEach((card) => {
      if (card.theme == "") {
        card.set = "Thème non renseignée";
      }

      let result = themes.find((theme) => theme == card.theme);
      if (result === undefined) {
        themes.push(card.theme);
      }
    });

    const select = document.getElementById("select-theme");

    let rowHtml = '<option selected="" value="0">Tous les thèmes</option>';
    let i = 1;
    themes.forEach((theme) => {
      rowHtml += `<option value="${i}">${theme}</option>`;
      i++;
    });

    select.innerHTML = rowHtml;
  }

  /** Filter the set list depending on the theme */
  static filterSetList(theme) {}

  // static deleteBook(el) {
  //    if (el.classList.contains('delete')) {
  //       el.parentElement.parentElement.remove();
  //    }
  // }

  // static showAlert(message, className) {
  //    const div = document.createElement('div');
  //    div.className = `alert alert-${className}`;
  //    div.appendChild(document.createTextNode(message));
  //    const container = document.querySelector('.container');
  //    const form = document.querySelector('#book-form');
  //    container.insertBefore(div, form);

  //    // Vanish in 3 seconds
  //    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  // }

  // static clearFields() {
  //    document.querySelector('#id').value = '';
  //    document.querySelector('#recto').value = '';
  //    document.querySelector('#verso').value = '';
  //    document.querySelector('#verso').value = '';
  // }
}
