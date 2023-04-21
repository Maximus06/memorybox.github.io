import { data } from "./data.js";


// Store Class: Handles Storage
export class Store {

  /**
   * Return the cards from the local storage if there is items
   * Otherwise, return a exemple of cards
   * @returns The cards array.
   */
  static getCards() {
    let cards;
    if (localStorage.getItem("cards") === null) {
      // extract exemple cards.
      cards = data.slice();
    } else {
      cards = JSON.parse(localStorage.getItem("cards"));
    }

    return cards;
  }

/**
 * It takes an array of cards and saves it to local storage.
 * @param cards - The array of cards to save to localStorage.
 */
  static saveCards(cards) {
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  static changeCardSens(id) {
    const cards = this.getCards()
    let cardFound = false;

    cards.forEach((card) => {
      if (card.id === id) {
        cardFound = true;
        if (card.sens == 1) {
          card.sens = 2;
        } else {
          card.sens = 1;
        }
      }
    });

    if (!cardFound) {
      alert(`L'identifiant ${id} n'a pas été trouvé 😱`);
    }

    this.saveCards(cards);
  }

    static checkDoublon() {
      const cards = this.getCards()
      

      let ids = [];
      cards.forEach((card) => {
        ids.push(card.id)
      });

      const lenCards = ids.length
      console.log('nombre de cartes :', ids.length)

      // create a set to get unique id.
      const setIds = new Set(ids)
      console.log('nombre de carte unique :', setIds.size)
      console.log('nombre de doublon détecté(s) :', lenCards - setIds.size)

      if (lenCards - setIds.size >= 1) {
        // there is doublon
        this.resetId(cards);
      }
    }

    static resetId(cards) {
      const newCards = [];
      let id = 1;

      cards.forEach((card) => {
        card.id = id;
        newCards.push(card);
        id ++;
      });

      this.saveCards(newCards);
    }

  }

  // ==========================================================================
// Book exemple
  // static addBook(book) {
  //   const books = Store.getBooks();
  //   books.push(book);
  //   localStorage.setItem("books", JSON.stringify(books));
  // }

  // static removeBook(verso) {
  //   const books = Store.getBooks();

  //   books.forEach((book, index) => {
  //     if (book.verso === verso) {
  //       books.splice(index, 1);
  //     }
  //   });

  //   localStorage.setItem("books", JSON.stringify(books));
  // }

