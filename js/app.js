import { Store } from "./store.js";
import { UI } from "./UI.js";

// general class for the application
export class App {
  constructor() {
    this.cards = [];
  }

  static init() {
    console.log("dans init");
    // get the cards from the local store and filter on the active cards
    this.cards = Store.getCards().filter((card) => card.active === true);

    // sort desc (last first)
    this.cards.sort((a, b) => b.id - a.id);

    this.step = 1;
    this.set = "*";
    this.theme = "*";

    // get the greater id
    let maxId = this.cards.reduce(function (a, b) {
      return Math.max(a.id, b.id);
    });

    UI.fillThemeList();
    UI.fillSetList();

    // calcul le nombre de card par step et affecte les badges respectifs
    UI.calcCardNumberByStep(this.cards);

    UI.displayCards(this.cards.filter((card) => card.step == 1));
  }

  /**
   * Forward or backward the card in steps
   *
   * @param {boolean} memorized is the card memorized ?
   * @param {Integer} id the id of the card
   */
  static consolidateCard(memorized, id) {
    // get the index of the card in the global array card
    let index = App.cards.findIndex((card) => card.id == id);

    if (memorized) {
      App.cards[index].step++;
      if (App.cards[index].step > 7) {
        App.cards[index].step = 7;
      }
    } else {
      App.cards[index].step--;
      if (App.cards[index].step < 1) {
        App.cards[index].step = 1;
      }
    }

    if (App.cards[index].sens == 1) {
      App.cards[index].sens = 2;
    } else {
      App.cards[index].sens = 1;
    }

    this.refreshCardsList();

    UI.calcCardNumberByStep();

    Store.saveCards(App.cards);
  }

  static refreshCardsList() {
    let filteredCards;

    if (App.theme === "*" && App.set === "*") {
      // cas pas de theme selectionné ni de série
      filteredCards = App.cards.filter((card) => card.step == App.step);
    } else if (App.theme !== "*" && App.set === "*") {
      // cas un theme selectionné mais pas de série
      filteredCards = App.cards.filter(
        (card) => card.step == App.step && card.theme == App.theme
      );
    } else if (App.theme === "*" && App.set !== "*") {
      // cas pas de theme selectionné mais une série
      filteredCards = App.cards.filter(
        (card) => card.step == App.step && card.set == App.set
      );
    } else {
      // cas theme et série sélectionnées
      filteredCards = App.cards.filter(
        (card) =>
          card.step == App.step &&
          card.set == App.set &&
          card.theme == App.theme
      );
    }

    // if (filterSet === '' || filterSet === "*") {
    //    filteredCards = App.cards.filter(card => card.step == App.step);
    // } else {
    //    filteredCards = App.cards.filter(card => card.step == App.step && card.set == filterSet);
    // }

    // const filteredCards = App.cards.filter(card => card.step == App.step && card.active == true && card.set == 'Roi de France');
    // const filteredCards = App.cards.filter(card => card.step == 1 && card.active === true && card.set == 'Roi de France');

    // del existing html
    document.querySelector("#card-container").innerHTML = "";

    // redisplay cards
    UI.displayCards(filteredCards);
  }
}
